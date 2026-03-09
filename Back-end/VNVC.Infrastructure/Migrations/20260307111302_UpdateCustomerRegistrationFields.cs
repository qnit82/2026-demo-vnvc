using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VNVC.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCustomerRegistrationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GuardianName",
                table: "Customers",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuardianPhone",
                table: "Customers",
                type: "nvarchar(15)",
                maxLength: 15,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuardianRelation",
                table: "Customers",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdentityCard",
                table: "Customers",
                type: "nvarchar(12)",
                maxLength: 12,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MedicalHistory",
                table: "Customers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GuardianName",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "GuardianPhone",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "GuardianRelation",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "IdentityCard",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "MedicalHistory",
                table: "Customers");
        }
    }
}
