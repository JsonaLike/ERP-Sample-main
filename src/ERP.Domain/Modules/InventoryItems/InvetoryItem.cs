using ERP.Domain.Core.Models;
using ERP.Domain.Core.Specifications;
using ERP.Domain.Modules.Employees;
using ERP.Domain.Modules.Leaves;
using ERP.Domain.Modules.PurchaseOrderItems;
using ERP.Domain.Modules.PurchaseOrders;
using ERP.Domain.Modules.Roles;
using ERP.Domain.Modules.Users;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Domain.Modules.InventoryItems
{
    public class InventoryItem : BaseAuditableEntity
    {
        
        public InventoryItem() {
        
        }
        public class InventoryItemViewModel
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public string? Description { get; set; }
            public decimal Price { get; set; }
            public decimal Quantity { get; set; }
            public decimal InventoryValue { get; set; }
        }
        public InventoryItem(Guid id, string name, string? description, decimal price, decimal quantity, Guid createdBy)
        {
            Id = id;
            Name = name;
            Description = description;
            CreatedOn = DateTimeOffset.UtcNow;
            ModifiedOn= DateTimeOffset.UtcNow;
            Price = price;
            Quantity = quantity;
            InventoryValue = (price * quantity);
            CreatedBy= createdBy;
            ModifiedBy = ModifiedBy;
        }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public decimal Quantity { get; set; }
        public decimal InventoryValue { get; set; }
        public Employee CreatedByEmp { get; set; }
        public List<PurchaseOrder> PurchaseOrders { get; set; } = new();

        public static InventoryItem CreateInventoryItem(string name, string? description, decimal price, decimal quantity,Guid createdBy)
        {
            return new InventoryItem(Guid.NewGuid(),name, description, price, quantity,createdBy);
        }
    }
}
