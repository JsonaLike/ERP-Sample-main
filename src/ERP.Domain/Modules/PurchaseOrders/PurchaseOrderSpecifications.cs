using ERP.Domain.Core.Specifications;
using ERP.Domain.Modules.PurchaseOrderItems;
using ERP.Domain.Modules.PurchaseOrders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ERP.Domain.Modules.InventoryItems;

namespace ERP.Domain.Modules.PurchaseOrders
{
    public class PurchaseOrderSpecifications
    {

        public static BaseSpecification<PurchaseOrder> GetAllPurchaseOrdersSpec()
        {
            var spec = new BaseSpecification<PurchaseOrder>();
            spec.ApplyOrderByDescending(x => x.PurchaseOrderDate);
            return spec;
        }

        public static BaseSpecification<PurchaseOrder> GetPurchaseOrderByIdSpec(Guid id)
        {
            return new BaseSpecification<PurchaseOrder>(x => x.Id == id);
        }
        public static BaseSpecification<PurchaseOrderItem> GetPurchaseOrderInventoryItemById(Guid POId, Guid InId)
        {
            var spec = new BaseSpecification<PurchaseOrderItem>(x => x.PurchaseOrderId == POId);
            spec.AddInclude( x=>x.PurchaseOrder);
            spec.AddInclude( x=>x.Item);
            spec.ApplyWhere(x=>x.ItemId == InId);
            return spec;
        }
        public static BaseSpecification<PurchaseOrderItem> GetPurchaseOrderItemsByIdSpec(Guid id)
        {
            return new BaseSpecification<PurchaseOrderItem>(x => x.PurchaseOrderId == id);
        }
        /*public static BaseSpecification<PurchaseOrder> SearchPurchaseOrdersSpec(string searchKeyword)
        {

            var spec = new BaseSpecification<PurchaseOrder>(x => x.InventoryItems.Name.Contains(searchKeyword)
                    || x.Notes.Contains(searchKeyword));
            spec.ApplyOrderByDescending(x => x.PurchaseOrderDate);
            return spec;
        }*/
    }
}
