using ERP.Domain.Core.Specifications;
using ERP.Domain.Modules.Vendors;

namespace ERP.Domain.Modules.Vendors
{
    public class VendorSpecifications
    {
        public static BaseSpecification<Vendor> GetAllVendorsSpec()
        {
            var spec = new BaseSpecification<Vendor>();
            spec.ApplyOrderByDescending(x => x.CreatedBy);
            return spec;
        }
        public static BaseSpecification<Vendor> GetVendorByIdSpec(Guid id)
        {
            return new BaseSpecification<Vendor>(x => x.Id == id);
        }

        public static BaseSpecification<Vendor> SearchVendorsSpec(string searchKeyword)
        {

            var spec = new BaseSpecification<Vendor>(x => x.VendorName.Contains(searchKeyword)
                    || x.ContactName.Contains(searchKeyword));
            spec.ApplyOrderByDescending(x => x.CreatedOn);
            return spec;
        }
        }
    }

