using ERP.Domain.Core.Specifications;

namespace ERP.Domain.Modules.InventoryItems
{
    public class InventoryItemSpecification
    {
        public static BaseSpecification<InventoryItem> GetAllInventoryItemsSpec()
        {
            var spec = new BaseSpecification<InventoryItem>();
            spec.ApplyOrderByDescending(x => x.CreatedBy);
            return spec;
        }

        public static BaseSpecification<InventoryItem> GetInventoryItemByIdSpec(Guid id)
        {
            return new BaseSpecification<InventoryItem>(x => x.Id == id);
        }

        public static BaseSpecification<InventoryItem> SearchInventoryItemsSpec(string searchKeyword)
        {

            var spec = new BaseSpecification<InventoryItem>(x => x.Name.Contains(searchKeyword)
                    || x.Description.Contains(searchKeyword));
            spec.ApplyOrderByDescending(x => x.CreatedOn);
            return spec;
        }
    }
}
