using System.ComponentModel.DataAnnotations;

namespace AngularAuthApi.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Email { get; set; } = string.Empty;

        public string? PasswordHash { get; set; }
        public string Role { get; set; } = "client";
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? IdNumber { get; set; }
        public string? Category { get; set; }
        public int starNum { get; set; }
        public string? ImageUrl { get; set; }
        public string? CvUrl { get; set; }
        public bool IsAdmin { get; set; } = false;

        // Refresh Token Support
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
    }
}
