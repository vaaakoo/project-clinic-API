using System.ComponentModel.DataAnnotations;

namespace AngularAuthApi.Models
{
    public class ActivationCode
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Code { get; set; }

        [Required]
        public DateTime CreationTime { get; set; }

        [Required]
        public DateTime ExpirationTime { get; set; }

        [Required]
        public bool Used { get; set; }
    }

}
