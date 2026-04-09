using AngularAuthApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AngularAuthApi.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Appointment> tblAppointment { get; set; }
        public DbSet<ActivationCode> ActivationCodes { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>().ToTable("users");
        }
    }
}
