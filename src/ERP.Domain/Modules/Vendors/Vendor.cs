using ERP.Domain.Core.Models;

namespace ERP.Domain.Modules.Vendors
{
    public class Vendor:BaseAuditableEntity
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

        public Vendor(Guid id, string vendorName, string vendorAddress, string vendorCity, string vendorZipCode, string vendorCountry, string vendorPhone, string vendorEmail, string contactName, string contactNotes,Guid createdBy)
        {
            Id = id;
            VendorName = vendorName;
            VendorAddress = vendorAddress;
            VendorCity = vendorCity;
            VendorZipCode = vendorZipCode;
            VendorCountry = vendorCountry;
            VendorPhone = vendorPhone;
            VendorEmail = vendorEmail;
            ContactName = contactName;
            ContactNotes = contactNotes;
            CreatedBy = createdBy;
            ModifiedBy = createdBy;
        }
        public static Vendor CreateVendor(string vendorName, string vendorAddress, string vendorCity, string vendorZipCode, string vendorCountry, string vendorPhone, string vendorEmail, string contactName, string contactNotes, Guid createdBy)
        {
            return new Vendor(Guid.NewGuid(), vendorName, vendorAddress, vendorCity, vendorZipCode, vendorCountry, vendorPhone, vendorEmail, contactName, contactNotes,createdBy);
        }
    }
}
