using Microsoft.EntityFrameworkCore;
using VNVC.Domain.Entities;

namespace VNVC.Infrastructure.Persistence;

public class VNVCDbContext : DbContext
{
    public VNVCDbContext(DbContextOptions<VNVCDbContext> options) : base(options)
    {
    }

    public DbSet<Customer> Customers { get; set; } = null!;
    public DbSet<Vaccine> Vaccines { get; set; } = null!;
    public DbSet<VaccineBatch> VaccineBatches { get; set; } = null!;
    public DbSet<Visit> Visits { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<OrderDetail> OrderDetails { get; set; } = null!;
    public DbSet<ScreeningResult> ScreeningResults { get; set; } = null!;
    public DbSet<Prescription> Prescriptions { get; set; } = null!;
    public DbSet<Invoice> Invoices { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<InjectionLog> InjectionLogs { get; set; } = null!;
    public DbSet<PostInjectionMonitoring> PostInjectionMonitorings { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Cấu hình PID duy nhất cho Customer
        modelBuilder.Entity<Customer>()
            .HasIndex(c => c.PID)
            .IsUnique();

        // Cấu hình quan hệ Cha-Con cho Customer
        modelBuilder.Entity<Customer>()
            .HasOne(c => c.Parent)
            .WithMany(c => c.Children)
            .HasForeignKey(c => c.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Cấu hình Invoice
        modelBuilder.Entity<Invoice>()
            .Property(i => i.TotalAmount)
            .HasPrecision(18, 2);

        // Cấu hình Vaccine Price
        modelBuilder.Entity<Vaccine>()
            .Property(v => v.Price)
            .HasPrecision(18, 2);

        // Cấu hình Order Price
        modelBuilder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<OrderDetail>()
            .Property(od => od.UnitPrice)
            .HasPrecision(18, 2);

        // Cấu hình ScreeningResult
        modelBuilder.Entity<ScreeningResult>(entity =>
        {
            entity.Property(s => s.Height).HasPrecision(5, 2);
            entity.Property(s => s.Weight).HasPrecision(5, 2);
            entity.Property(s => s.Temperature).HasPrecision(4, 2);
        });

        // ── Cấu hình Quan hệ 1:1 cho Visit ────────────────────────────
        modelBuilder.Entity<Visit>(entity =>
        {
            // Quan hệ 1:1 với ScreeningResult
            entity.HasOne(v => v.ScreeningResult)
                .WithOne(s => s.Visit)
                .HasForeignKey<ScreeningResult>(s => s.VisitId);

            // Quan hệ 1:1 với Order
            entity.HasOne(v => v.Order)
                .WithOne(o => o.Visit)
                .HasForeignKey<Order>(o => o.VisitId);

            // Quan hệ 1:1 với Invoice
            entity.HasOne(v => v.Invoice)
                .WithOne(i => i.Visit)
                .HasForeignKey<Invoice>(i => i.VisitId);
        });

        // Cấu hình InjectionLog & Monitoring
        modelBuilder.Entity<InjectionLog>(entity =>
        {
            entity.HasOne(il => il.Prescription)
                .WithMany()
                .HasForeignKey(il => il.PrescriptionId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(il => il.Batch)
                .WithMany()
                .HasForeignKey(il => il.BatchId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(il => il.Monitoring)
                .WithOne(m => m.InjectionLog)
                .HasForeignKey<PostInjectionMonitoring>(m => m.InjectionLogId);
        });
    }
}
