using AngularAuthApi.Models.DTOs;

namespace AngularAuthApi.Services.Interfaces
{
    public interface IBookingService
    {
        Task<List<AppointmentDto>> GetClientAppointmentsAsync(string clientIdNumber);
        Task<List<AppointmentDto>> GetClientAppointmentsByTdidAsync(string clientIdNumber, string tdId);
        Task<bool> BookAppointmentAsync(AppointmentDto appointmentDto);
        Task<bool> RemoveAppointmentAsync(AppointmentDto appointmentDto);
        Task<List<AppointmentDto>> GetDoctorAppointmentsAsync(string idNumber);
        Task<List<AppointmentDto>> GetDoctorAppointmentsByTdidAsync(string idNumber, string tdId);
    }
}
