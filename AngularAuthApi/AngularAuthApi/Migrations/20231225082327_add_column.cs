using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AngularAuthApi.Migrations
{
    /// <inheritdoc />
    public partial class add_column : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PatientName",
                table: "tblAppointment",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PatientName",
                table: "tblAppointment");
        }
    }
}
