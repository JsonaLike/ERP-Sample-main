using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ERP.DbMigrations.Migrations
{
    /// <inheritdoc />
    public partial class testselk3243 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseOrderItems_PurchaseOrders_PurchaseOrdersId",
                table: "PurchaseOrderItems");

            migrationBuilder.DropIndex(
                name: "IX_PurchaseOrderItems_PurchaseOrdersId",
                table: "PurchaseOrderItems");

            migrationBuilder.DropColumn(
                name: "ItemsId",
                table: "PurchaseOrderItems");

            migrationBuilder.DropColumn(
                name: "PurchaseOrdersId",
                table: "PurchaseOrderItems");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrderItems_PurchaseOrderId",
                table: "PurchaseOrderItems",
                column: "PurchaseOrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseOrderItems_PurchaseOrders_PurchaseOrderId",
                table: "PurchaseOrderItems",
                column: "PurchaseOrderId",
                principalTable: "PurchaseOrders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseOrderItems_PurchaseOrders_PurchaseOrderId",
                table: "PurchaseOrderItems");

            migrationBuilder.DropIndex(
                name: "IX_PurchaseOrderItems_PurchaseOrderId",
                table: "PurchaseOrderItems");

            migrationBuilder.AddColumn<Guid>(
                name: "ItemsId",
                table: "PurchaseOrderItems",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "PurchaseOrdersId",
                table: "PurchaseOrderItems",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrderItems_PurchaseOrdersId",
                table: "PurchaseOrderItems",
                column: "PurchaseOrdersId");

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseOrderItems_PurchaseOrders_PurchaseOrdersId",
                table: "PurchaseOrderItems",
                column: "PurchaseOrdersId",
                principalTable: "PurchaseOrders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
