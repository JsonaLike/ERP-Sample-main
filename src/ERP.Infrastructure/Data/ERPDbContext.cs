using System.Linq.Expressions;
using ERP.Domain.Core.Models;
using ERP.Domain.Modules.Departments;
using ERP.Domain.Modules.Designations;
using ERP.Domain.Modules.Employees;
using ERP.Domain.Modules.InventoryItems;
using ERP.Domain.Modules.Leaves;
using ERP.Domain.Modules.PurchaseOrderItems;
using ERP.Domain.Modules.PurchaseOrders;
using ERP.Domain.Modules.Roles;
using ERP.Domain.Modules.Users;
using ERP.Domain.Modules.Vendors;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace ERP.Infrastructure.Data
{
    public class ERPDbContext : DbContext
    {
        public ERPDbContext(DbContextOptions<ERPDbContext> options) : base(options)
        {
            ChangeTracker.LazyLoadingEnabled = false;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Enable sensitive data logging
            optionsBuilder.EnableSensitiveDataLogging();

            base.OnConfiguring(optionsBuilder);
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            Expression<Func<BaseAuditableEntity, bool>> filterExpr = x => !x.IsDeleted;
            foreach (var mutableEntityType in modelBuilder.Model.GetEntityTypes())
            {
                // check if current entity type is child of BaseEntity
                if (mutableEntityType.ClrType.IsAssignableTo(typeof(BaseAuditableEntity)))
                {
                    // modify expression to handle correct child type
                    var parameter = Expression.Parameter(mutableEntityType.ClrType);
                    var body = ReplacingExpressionVisitor.Replace(filterExpr.Parameters.First(), parameter, filterExpr.Body);
                    var lambdaExpression = Expression.Lambda(body, parameter);

                    // set filter
                    mutableEntityType.SetQueryFilter(lambdaExpression);
                }
            }
           

            modelBuilder.Entity<InventoryItem>(entity =>
            {
                entity.HasKey(x => x.Id);
                entity.HasOne(x => x.CreatedByEmp)
                .WithMany()
                .HasForeignKey(x => x.CreatedBy);
                
            });

            modelBuilder.Entity<InventoryItem>().Navigation(e => e.CreatedByEmp).AutoInclude();
            modelBuilder.Entity<PurchaseOrder>(entity =>
            {
                entity.HasKey(x => x.Id);
            });

           modelBuilder.Entity<PurchaseOrder>()
                   .HasMany(e => e.InventoryItems)
                   .WithMany(e => e.PurchaseOrders)
              .UsingEntity<PurchaseOrderItem>();
         
            modelBuilder.Entity<PurchaseOrderItem>().Navigation(e => e.Item).AutoInclude();
            modelBuilder.Entity<PurchaseOrderItem>().Navigation(e => e.PurchaseOrder).AutoInclude();

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<EmployeePersonalDetail> EmployeePersonalDetails { get; set; }
        public DbSet<EmployeeBankDetail> EmployeeBankDetails { get; set; }
        public DbSet<EmployeeEducationDetail> EmployeeEducationDetails { get; set; }
        public DbSet<EmployeeDocument> EmployeeDocuments { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<Designation> Designations { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<LeaveType> LeaveTypes { get; set; }
        public DbSet<Holiday> Holidays { get; set; }
        public DbSet<InventoryItem> InventoryItems { get; set; }
        public DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
    }
}