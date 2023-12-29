using AngularAuthApi.Models;
using AngularAuthApi.Repositories.Interfaces;
using AngularAuthYtAPI.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AngularAuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Booking : ControllerBase
    {
        private readonly AppDbContext db;
        public Booking(AppDbContext context, IActivationCodeService activationCodeService)
        {
            db = context;
        }
        [HttpGet("getdata")]
        public IActionResult getBookAppointments(string DoctorName)
        {
            var data = db.tblAppointment.Where(x => x.DoctorName.Equals(DoctorName)).ToList();
            if (data == null)
                return NotFound(new { message = "No Data Found" });
            return Ok(data);

        }

        [HttpPost("BookAppointment")]
        public IActionResult BookAppointment(Appointment appointment)
        {
            if (appointment != null)
            {
                db.Add(appointment);
                db.SaveChanges();
                return Ok();
            }

            return BadRequest();
        }



        [HttpPost("RemoveAppointment")]
        public IActionResult RemoveAppointment(Appointment appointment)
        {
            if (appointment != null)
            {
                var data = db.tblAppointment.Where(x => x.DoctorName == appointment.DoctorName && x.UniqueNumber==appointment.UniqueNumber).FirstOrDefault();
                db.Remove(data);
                db.SaveChanges();
                return Ok();
            }

            return BadRequest();
        }


        [HttpGet("getclient")]
        public IActionResult getClientAppointments(string Client)
        {
            var data = db.tblAppointment.Where(x => x.DoctorName.Equals(Client)).ToList();
            if (data == null)
                return NotFound(new { message = "No Data Found" });
            return Ok(data);

        }

        [HttpPost("ClientBookAppointment")]
        public IActionResult ClientBookAppointment(Appointment appointment)
        {
            if (appointment != null)
            {
                db.Add(appointment);
                db.SaveChanges();
                return Ok();
            }

            return BadRequest();
        }



        [HttpPost("ClientRemoveAppointment")]
        public IActionResult ClientRemoveAppointment(Appointment appointment)
        {
            if (appointment != null)
            {
                var data = db.tblAppointment.Where(x => x.DoctorName == appointment.DoctorName && x.UniqueNumber == appointment.UniqueNumber && x.PatientName==appointment.PatientName).FirstOrDefault();
                db.Remove(data);
                db.SaveChanges();
                return Ok();
            }

            return BadRequest();
        }

    }
}
