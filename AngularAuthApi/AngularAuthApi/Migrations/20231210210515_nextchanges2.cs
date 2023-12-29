using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AngularAuthApi.Migrations
{
    /// <inheritdoc />
    public partial class nextchanges2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Token",
                table: "users",
                newName: "ImageUrl");

            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CvUrl",
                table: "users",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "users");

            migrationBuilder.DropColumn(
                name: "CvUrl",
                table: "users");

            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "users",
                newName: "Token");

            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
