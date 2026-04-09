namespace AngularAuthApi.Services
{
    public class BookingService(AppDbContext context) : IBookingService
    {
        public async Task<List<AppointmentDto>> GetClientAppointmentsAsync(string clientIdNumber)
        {
            var appointments = await context.tblAppointment
                .Where(x => x.ClientIdNumber == clientIdNumber)
                .ToListAsync();

            return appointments.Select(MapToDto).ToList();
        }

        public async Task<List<AppointmentDto>> GetClientAppointmentsByTdidAsync(string clientIdNumber, string tdId)
        {
            var appointments = await context.tblAppointment
                .Where(x => x.ClientIdNumber == clientIdNumber && x.UniqueNumber == tdId)
                .ToListAsync();

            return appointments.Select(MapToDto).ToList();
        }

        public async Task<bool> BookAppointmentAsync(AppointmentDto dto)
        {
            if (dto.ClientIdNumber == "00000000000") return false;

            var appointment = new Appointment
            {
                DoctorName = dto.DoctorName,
                PatientName = dto.PatientName,
                UniqueNumber = dto.UniqueNumber,
                Status = dto.Status,
                IdNumber = dto.IdNumber,
                ClientIdNumber = dto.ClientIdNumber,
                MessageToDoctor = dto.MessageToDoctor
            };

            await context.tblAppointment.AddAsync(appointment);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveAppointmentAsync(AppointmentDto dto)
        {
            var appointment = await context.tblAppointment
                .FirstOrDefaultAsync(x => x.IdNumber == dto.IdNumber && x.UniqueNumber == dto.UniqueNumber && (string.IsNullOrEmpty(dto.PatientName) || x.PatientName == dto.PatientName));

            if (appointment == null) return false;

            context.tblAppointment.Remove(appointment);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<List<AppointmentDto>> GetDoctorAppointmentsAsync(string idNumber)
        {
            var appointments = await context.tblAppointment
                .Where(x => x.IdNumber == idNumber)
                .ToListAsync();

            return appointments.Select(MapToDto).ToList();
        }

        public async Task<List<AppointmentDto>> GetDoctorAppointmentsByTdidAsync(string idNumber, string tdId)
        {
            var appointments = await context.tblAppointment
                .Where(x => x.IdNumber == idNumber && x.UniqueNumber == tdId)
                .ToListAsync();

            return appointments.Select(MapToDto).ToList();
        }

        private static AppointmentDto MapToDto(Appointment appointment)
        {
            return new AppointmentDto
            {
                Id = appointment.Id,
                DoctorName = appointment.DoctorName,
                PatientName = appointment.PatientName,
                UniqueNumber = appointment.UniqueNumber,
                Status = appointment.Status,
                IdNumber = appointment.IdNumber,
                ClientIdNumber = appointment.ClientIdNumber,
                MessageToDoctor = appointment.MessageToDoctor
            };
        }
    }
}
