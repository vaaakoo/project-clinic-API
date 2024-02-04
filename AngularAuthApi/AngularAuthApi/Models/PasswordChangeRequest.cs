using System.ComponentModel.DataAnnotations;

namespace AngularAuthApi.Models
{
    public class PasswordChangeRequest
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string OldPassword { get; set; }

        [Required]
        public string NewPassword { get; set; }
    }
}
