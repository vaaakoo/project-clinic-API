namespace AngularAuthApi.Models.DTOs
{
    public class RegisterUserDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string IdNumber { get; set; }
        public required string activationcode { get; set; }
    }

    public class RegisterDoctorDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string IdNumber { get; set; }
        public string? Category { get; set; }
        public string? ImageUrl { get; set; }
        public string? CvUrl { get; set; }
        public int? starNum { get; set; }
    }

    public class UpdateDoctorDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? IdNumber { get; set; }
        public string? Category { get; set; }
        public int? starNum { get; set; }
        public string? ImageUrl { get; set; }
        public string? CvUrl { get; set; }
    }

    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string IdNumber { get; set; } = string.Empty;
        public string? Category { get; set; }
        public int starNum { get; set; }
        public string? ImageUrl { get; set; }
        public string? CvUrl { get; set; }
        public bool IsAdmin { get; set; }
    }
}
