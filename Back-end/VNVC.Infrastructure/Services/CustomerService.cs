using Microsoft.EntityFrameworkCore;
using VNVC.Application.DTOs;
using VNVC.Application.Interfaces;
using VNVC.Application.Responses;
using VNVC.Domain.Entities;
using VNVC.Domain.Enums;
using VNVC.Infrastructure.Persistence;
using VNVC.Application.DTOs;

namespace VNVC.Infrastructure.Services;

public class CustomerService : ICustomerService
{
    private readonly VNVCDbContext _context;

    public CustomerService(VNVCDbContext context)
    {
        _context = context;
    }

    public async Task<object> RegisterCustomerAsync(CreateCustomerRequest request)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // 1. Tạo hoặc Cập nhật Khách hàng
            int customerId;
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Phone == request.Phone || (request.IdentityCard != null && c.IdentityCard == request.IdentityCard));

            if (customer == null)
            {
                string pid = $"CUST{DateTime.Now:yyyyMMdd}{new Random().Next(100, 999)}";
                customer = new Customer
                {
                    PID = pid,
                    FullName = request.FullName,
                    DOB = request.DOB,
                    Gender = request.Gender,
                    Phone = request.Phone,
                    Address = request.Address,
                    IdentityCard = request.IdentityCard,
                    GuardianName = request.GuardianName,
                    GuardianPhone = request.GuardianPhone,
                    GuardianRelation = request.GuardianRelation,
                    MedicalHistory = request.MedicalHistory,
                    ParentId = request.ParentId
                };
                _context.Customers.Add(customer);
            }
            else
            {
                // Cập nhật thông tin nếu có thay đổi
                customer.FullName = request.FullName;
                customer.DOB = request.DOB;
                customer.Address = request.Address;
                customer.MedicalHistory = request.MedicalHistory;
                _context.Customers.Update(customer);
            }

            await _context.SaveChangesAsync();
            customerId = customer.Id;

            // 2. Tạo Lượt khám (Visit)
            var visit = new Visit
            {
                CustomerId = customerId,
                CheckInTime = DateTime.UtcNow,
                Status = VisitStatus.WaitScreening
            };
            _context.Visits.Add(visit);
            await _context.SaveChangesAsync();

            // 3. Nếu có chọn Vắc xin, tạo Order và OrderDetails
            if (request.VaccineIds != null && request.VaccineIds.Any())
            {
                var vaccines = await _context.Vaccines
                    .Where(v => request.VaccineIds.Contains(v.Id))
                    .ToListAsync();

                var order = new Order
                {
                    VisitId = visit.Id,
                    OrderNumber = $"ORD{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}",
                    OrderDate = DateTime.UtcNow,
                    Status = OrderStatus.Pending,
                    TotalAmount = vaccines.Sum(v => v.Price)
                };
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                foreach (var v in vaccines)
                {
                    _context.OrderDetails.Add(new OrderDetail
                    {
                        OrderId = order.Id,
                        VaccineId = v.Id,
                        Quantity = 1,
                        UnitPrice = v.Price
                    });
                }

                // 4. Tạo Invoice tạm tính (Chưa thanh toán)
                var invoice = new Invoice
                {
                    VisitId = visit.Id,
                    TotalAmount = order.TotalAmount,
                    PaymentStatus = PaymentStatus.Pending
                };
                _context.Invoices.Add(invoice);

                await _context.SaveChangesAsync();
            }

            await transaction.CommitAsync();
            return new { CustomerId = customerId, VisitId = visit.Id };
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<int> CreateVisitAsync(CreateVisitRequest request)
    {
        var visit = new Visit
        {
            CustomerId = request.CustomerId,
            CheckInTime = DateTime.UtcNow,
            Status = VisitStatus.WaitScreening
        };

        _context.Visits.Add(visit);
        await _context.SaveChangesAsync();
        return visit.Id;
    }

    public async Task<PagedResult<CustomerListItemDTO>> GetPagedCustomersAsync(SearchCustomerRequest request)
    {
        var query = _context.Customers.AsNoTracking();

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(c => 
                c.PID.ToLower().Contains(term) ||
                c.FullName.ToLower().Contains(term) ||
                c.Phone.ToLower().Contains(term) ||
                c.IdentityCard != null && c.IdentityCard.ToLower().Contains(term) ||
                c.GuardianPhone != null && c.GuardianPhone.ToLower().Contains(term) ||
                c.Address.ToLower().Contains(term)
            );
        }

        var totalItems = await query.CountAsync();
        var items = await query
            .OrderByDescending(c => c.Id)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(c => new CustomerListItemDTO
            {
                Id = c.Id,
                PID = c.PID,
                FullName = c.FullName,
                DOB = c.DOB,
                Gender = c.Gender,
                Phone = c.Phone,
                Address = c.Address,
                IdentityCard = c.IdentityCard,
                GuardianName = c.GuardianName,
                GuardianPhone = c.GuardianPhone,
                GuardianRelation = c.GuardianRelation,
                MedicalHistory = c.MedicalHistory
            })
            .ToListAsync();

        return new PagedResult<CustomerListItemDTO>
        {
            Items = items,
            TotalItems = totalItems,
            PageNumber = request.Page,
            PageSize = request.PageSize
        };
    }
}
