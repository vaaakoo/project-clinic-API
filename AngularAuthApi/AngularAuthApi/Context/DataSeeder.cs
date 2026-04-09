using AngularAuthApi.Models.Configuration;
using AngularAuthApi.Context;
using AngularAuthApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

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
                Role = "admin",
                ImageUrl = "/assets/admin-image.jpg",
                IsAdmin = true
            };

            var initialDoctors = new List<User>
            {
                new User { FirstName = "გიორგი", LastName = "ხორავა", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000001", Category = "ანდროლოგი", starNum = 5, Email = "1@gmail.com", Role = "doctor", ImageUrl = "/assets/image1.jpg", IsAdmin = false},
                new User { FirstName = "ნატალია", LastName = "გოგოხია", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000002", Category = "ანესთეზიოლოგი", starNum = 3, Email = "2@gmail.com", Role = "doctor", ImageUrl = "/assets/image2.jpg", IsAdmin = false },
                new User { FirstName = "ანა", LastName = "დვლაი", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000003", Category = "კარდიოლოგი", starNum = 4, Email = "3@gmail.com", Role = "doctor", ImageUrl = "/assets/image3.jpg", IsAdmin = false },
                new User { FirstName = "გიორგი", LastName = "გაბიტაშვილი", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000004", Category = "კოსმეტოლოგი", starNum = 5, Email = "4@gmail.com", Role = "doctor", ImageUrl = "/assets/image4.jpg", IsAdmin = false },
                new User { FirstName = "ბარბარე", LastName = "ქორთუა", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000005", Category = "ლაბორანტი", starNum = 3, Email = "5@gmail.com", Role = "doctor", ImageUrl = "/assets/image5.jpg", IsAdmin = false },
                new User { FirstName = "გიორგი", LastName = "ხორავა", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000006", Category = "პედიატრი", starNum = 3, Email = "6@gmail.com", Role = "doctor", ImageUrl = "/assets/image6.jpg", IsAdmin = false },
                new User { FirstName = "ნატალია", LastName = "გაბიტაშვილი", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000007", Category = "ოჯახის ექიმი", starNum = 5, Email = "7@gmail.com", Role = "doctor", ImageUrl = "/assets/image7.jpg", IsAdmin = false },
                new User { FirstName = "გიორგი", LastName = "დვალი", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000008", Category = "ტოქსიკოლოგი", starNum = 2, Email = "8@gmail.com", Role = "doctor", ImageUrl = "/assets/image8.jpg", IsAdmin = false },
                new User { FirstName = "ანა", LastName = "გაბიტაშვილი", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000009", Category = "ტრანსფუზილოგი", starNum = 5, Email = "9@gmail.com", Role = "doctor", ImageUrl = "/assets/image9.jpg", IsAdmin = false },
                new User { FirstName = "დავით", LastName = "გიუნაშვილი", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000010", Category = "ოჯახის ექიმი", starNum = 4, Email = "10@gmail.com", Role = "doctor", ImageUrl = "/assets/image9.jpg", IsAdmin = false },
                new User { FirstName = "ზურაბ", LastName = "ანთაძე", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000011", Category = "თერაპევტი", starNum = 3, Email = "11@gmail.com", Role = "doctor", ImageUrl = "/assets/image9.jpg", IsAdmin = false },
                new User { FirstName = "ვაკო", LastName = "ჯანიკა", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="10000000001", Email = "v@gmail.com", Role = "client", ImageUrl = "/assets/image3.jpg", IsAdmin = false },
                new User { FirstName = "დავით", LastName = "გიუნა", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="10000000002", Email = "d@gmail.com", Role = "client", ImageUrl = "/assets/image3.jpg", IsAdmin = false },
                new User { FirstName = "გიროგი", LastName = "გიორგაძე", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="10000000003", Email = "g@gmail.com", Role = "client", ImageUrl = "/assets/image3.jpg", IsAdmin = false },
            };

            await context.Users.AddAsync(adminUser);
            await context.Users.AddRangeAsync(initialDoctors);
            await context.SaveChangesAsync();
        }
    }
}
