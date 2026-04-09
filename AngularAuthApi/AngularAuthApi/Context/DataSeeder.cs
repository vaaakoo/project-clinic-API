using AngularAuthApi.Models.Configuration;
using AngularAuthApi.Context;
using AngularAuthApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text.Json;
using AngularAuthApi.Constants;

namespace AngularAuthApi.Context
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(AppDbContext context, IOptions<AdminSettings> adminSettings)
        {
            if (await context.Users.AnyAsync()) return;

            var settings = adminSettings.Value;

            var adminUser = new User
            {
                FirstName = "Admin",
                LastName = "Admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(settings.Password),
                IdNumber = "00000000000",
                Email = settings.Email,
                Role = UserRoles.Admin,
                ImageUrl = "/assets/admin-image.jpg",
                IsAdmin = true
            };

            await context.Users.AddAsync(adminUser);

            // Seed from JSON file
            string seedDataPath = Path.Combine(AppContext.BaseDirectory, "seedData.json");
            
            // If not found in bin, check project root (for dev)
            if (!File.Exists(seedDataPath))
            {
                seedDataPath = "seedData.json"; 
            }

            if (File.Exists(seedDataPath))
            {
                var json = await File.ReadAllTextAsync(seedDataPath);
                var initialUsers = JsonSerializer.Deserialize<List<User>>(json);

                if (initialUsers != null)
                {
                    foreach (var user in initialUsers)
                    {
                        // Ensure all seeded users have the default hashed password
                        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456");
                        user.IsAdmin = user.Role == UserRoles.Admin;
                    }
                    await context.Users.AddRangeAsync(initialUsers);
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
