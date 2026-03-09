using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VNVC.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Migration_Inject_Entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InjectionLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PrescriptionId = table.Column<int>(type: "int", nullable: false),
                    NurseId = table.Column<int>(type: "int", nullable: true),
                    BatchId = table.Column<int>(type: "int", nullable: false),
                    InjectionSite = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InjectionTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InjectionLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InjectionLogs_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_InjectionLogs_Users_NurseId",
                        column: x => x.NurseId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_InjectionLogs_VaccineBatches_BatchId",
                        column: x => x.BatchId,
                        principalTable: "VaccineBatches",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PostInjectionMonitorings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InjectionLogId = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReactionNote = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsNormal = table.Column<bool>(type: "bit", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostInjectionMonitorings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PostInjectionMonitorings_InjectionLogs_InjectionLogId",
                        column: x => x.InjectionLogId,
                        principalTable: "InjectionLogs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InjectionLogs_BatchId",
                table: "InjectionLogs",
                column: "BatchId");

            migrationBuilder.CreateIndex(
                name: "IX_InjectionLogs_NurseId",
                table: "InjectionLogs",
                column: "NurseId");

            migrationBuilder.CreateIndex(
                name: "IX_InjectionLogs_PrescriptionId",
                table: "InjectionLogs",
                column: "PrescriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_PostInjectionMonitorings_InjectionLogId",
                table: "PostInjectionMonitorings",
                column: "InjectionLogId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PostInjectionMonitorings");

            migrationBuilder.DropTable(
                name: "InjectionLogs");
        }
    }
}
