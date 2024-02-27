using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AngularAuthYtAPI.Models
{
    public class Doctor
    {
        [Key]
        public int Id { get; set; }

        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? PasswordHash { get; set; }

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? IdNumber { get; set; }

        public string? Category { get; set; }

        public int? starNum { get; set; }

    }
}
