using MediatR;

namespace ERP.Application.Modules.Vendors.Commands
{

    public class CreateVendorCommand : IRequest<Guid>
    {
        public string VendorName { get; set; }
        public string VendorAddress { get; set; }
        public string VendorCity { get; set; }
        public string VendorZipCode { get; set; }
        public string VendorCountry { get; set; }
        public string VendorPhone { get; set; }
        public string VendorEmail { get; set; }
        public string ContactName { get; set; }
        public string ContactNotes { get; set; }

    }

    public class UpdateVendorCommand : IRequest<Guid>
    {
        public Guid Id { get; set; }
        public string VendorName { get; set; }
        public string VendorAddress { get; set; }
        public string VendorCity { get; set; }
        public string VendorZipCode { get; set; }
        public string VendorCountry { get; set; }
        public string VendorPhone { get; set; }
        public string VendorEmail { get; set; }
        public string ContactName { get; set; }
        public string ContactNotes { get; set; }

        public class DeleteVendorCommand : IRequest<Guid>
        {
            public Guid Id { get; set; }
        }
    }
}
