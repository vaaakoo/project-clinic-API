namespace AngularAuthApi.Models.Configuration
{
    public class JwtSettings
    {
        public string Secret { get; set; } = string.Empty;
        public int ExpirationDays { get; set; }
    }

    public class AdminSettings
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
