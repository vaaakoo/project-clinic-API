namespace AngularAuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookingController(IBookingService bookingService) : ControllerBase
    {
        [HttpGet("getdata")]
        public async Task<IActionResult> GetBookAppointments(string ClientIdNumber)
        {
            var data = await bookingService.GetClientAppointmentsAsync(ClientIdNumber);
            if (data == null || data.Count == 0)
                return NotFound(new { message = "No Data Found" });

            return Ok(new { data, Count = data.Count });
        }

        [HttpGet("getdataBytdid")]
        public async Task<IActionResult> GetBookAppointmentswithtd(string ClientIdNumber, string tdId)
        {
            var data = await bookingService.GetClientAppointmentsByTdidAsync(ClientIdNumber, tdId);
            if (data == null || data.Count == 0)
                return NotFound(new { message = "No Data Found" });

            return Ok(new { data, Count = data.Count });
        }

        [HttpPost("BookAppointment")]
        public async Task<IActionResult> BookAppointment(AppointmentDto appointment)
        {
            var result = await bookingService.BookAppointmentAsync(appointment);
            if (!result) return BadRequest();
            return Ok();
        }

        [HttpPost("RemoveAppointment")]
        public async Task<IActionResult> RemoveAppointment(AppointmentDto appointment)
        {
            var result = await bookingService.RemoveAppointmentAsync(appointment);
            if (!result) return BadRequest();
            return Ok();
        }

        [HttpGet("getclient")]
        public async Task<IActionResult> GetClientAppointments(string IdNumber)
        {
            var data = await bookingService.GetDoctorAppointmentsAsync(IdNumber);
            if (data == null || data.Count == 0)
                return NotFound(new { message = "No Data Found" });

            return Ok(new { data, Count = data.Count });
        }

        [HttpGet("getDoctordataBytdid")]
        public async Task<IActionResult> GetDoctordataBytdid(string IdNumber, string tdId)
        {
            var data = await bookingService.GetDoctorAppointmentsByTdidAsync(IdNumber, tdId);
            if (data == null || data.Count == 0)
                return NotFound(new { message = "No Data Found" });

            return Ok(new { data, Count = data.Count });
        }

        [HttpPost("ClientBookAppointment")]
        public async Task<IActionResult> ClientBookAppointment(AppointmentDto appointment)
        {
            var result = await bookingService.BookAppointmentAsync(appointment);
            if (!result) return BadRequest();
            return Ok();
        }

        [HttpPost("ClientRemoveAppointment")]
        public async Task<IActionResult> ClientRemoveAppointment(AppointmentDto appointment)
        {
            var result = await bookingService.RemoveAppointmentAsync(appointment);
            if (!result) return BadRequest();
            return Ok();
        }
    }
}
