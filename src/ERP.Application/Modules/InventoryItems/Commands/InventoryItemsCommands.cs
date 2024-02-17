using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Application.Modules.InventoryItems.Commands
{
    
        public class CreateInventoryItemCommand : IRequest<Guid>
        {
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public decimal Quantity { get; set; }

    }

    public class UpdateInventoryItemCommand : IRequest<Guid>
        {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public decimal Quantity { get; set; }
        public decimal InventoryValue { get; set; }
        public bool Discounted { get; set; }
    }

        public class DeleteInventoryItemCommand : IRequest<Guid>
        {
            public Guid Id { get; set; }
        }
}
