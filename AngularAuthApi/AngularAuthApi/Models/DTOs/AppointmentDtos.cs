namespace AngularAuthApi.Models.DTOs
{
    public class AppointmentDto
    {
        public int Id { get; set; }
        public string? DoctorName { get; set; }
        public string? PatientName { get; set; }
        public string UniqueNumber { get; set; } = string.Empty;
        public string? Status { get; set; }
        public string IdNumber { get; set; } = string.Empty;
        public string ClientIdNumber { get; set; } = string.Empty;
        public string MessageToDoctor { get; set; } = string.Empty;
    }
}
