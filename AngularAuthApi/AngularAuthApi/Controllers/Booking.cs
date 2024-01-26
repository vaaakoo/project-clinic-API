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
        public IActionResult GetBookAppointments(string ClientIdNumber)
        {
            var data = db.tblAppointment.Where(x => x.ClientIdNumber.Equals(ClientIdNumber)).ToList();
            if (data == null || data.Count == 0)
                return NotFound(new { message = "No Data Found" });

            var count = data.Count;

            return Ok(new { data, Count = count });
        }

        [HttpGet("getdataByTarget/")]
        public IActionResult getdataByTarget(string UniqueNumber)
        {
            var data = db.tblAppointment.Where(x => x.UniqueNumber.Equals(UniqueNumber)).ToList();
            if (data == null || data.Count == 0)
                return NotFound(new { message = "No Data Found" });

            var count = data.Count;

            return Ok(new { data, Count = count });
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
                var data = db.tblAppointment.Where(x => x.IdNumber == appointment.IdNumber && x.UniqueNumber==appointment.UniqueNumber).FirstOrDefault();
                db.Remove(data);
                db.SaveChanges();
                return Ok();
            }

            return BadRequest();
        }


        [HttpGet("getclient")]
        public IActionResult getClientAppointments(string IdNumber)
        {
            var data = db.tblAppointment.Where(x => x.IdNumber.Equals(IdNumber)).ToList();
            if (data == null)
                return NotFound(new { message = "No Data Found" });


            var count = data.Count;

            return Ok(new { data, Count = count });

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
                var data = db.tblAppointment.Where(x => x.IdNumber == appointment.IdNumber && x.UniqueNumber == appointment.UniqueNumber && x.PatientName==appointment.PatientName).FirstOrDefault();
                db.Remove(data);
                db.SaveChanges();
                return Ok();
            }

            return BadRequest();
        }

    }
}
