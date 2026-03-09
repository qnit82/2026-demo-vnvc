using VNVC.WebAPI.Extensions;

var builder = WebApplication.CreateBuilder(args);

// ── Tầng Cơ sở dữ liệu (Infrastructure) ────────────────────────
builder.Services.AddDatabase(builder.Configuration);

// ── Tầng Dịch vụ (Application Services - DI) ────────────────────
builder.Services.AddApplicationServices();

// ── Cấu hình Bảo mật (Security) ─────────────────────────────────
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddCorsPolicies(builder.Configuration);

// ── Cấu hình API ────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ── Build Pipeline ──────────────────────────────────────────────
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
