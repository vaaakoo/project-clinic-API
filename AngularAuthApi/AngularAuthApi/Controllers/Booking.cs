using AngularAuthApi.Models;
using AngularAuthApi.Repositories.Interfaces;
using AngularAuthYtAPI.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AngularAuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class Booking : ControllerBase
    {
        private readonly AppDbContext db;
        public Booking(AppDbContext context, IActivationCodeService activationCodeService)
        {
            db = context;
        }
       
        //clients data
        [HttpGet("getdata")]
        public IActionResult GetBookAppointments(string ClientIdNumber)
        {
            var data = db.tblAppointment.Where(x => x.ClientIdNumber.Equals(ClientIdNumber)).ToList();
            if (data == null || data.Count == 0)
                return NotFound(new { message = "No Data Found" });

            var count = data.Count;

            return Ok(new { data, Count = count });
        }

        [HttpGet("getdataBytdid")]
        public IActionResult GetBookAppointmentswithtd(string ClientIdNumber, string tdId)
        {
            try
            {
                // Assuming tdId is stored in the UniqueNumber property of the Appointment model
                var data = db.tblAppointment
                    .Where(x => x.ClientIdNumber.Equals(ClientIdNumber) && x.UniqueNumber.Equals(tdId))
                    .ToList();

                if (data == null || data.Count == 0)
                    return NotFound(new { message = "No Data Found" });

                var count = data.Count;

                return Ok(new { data, Count = count });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(500, new { Message = "Error retrieving appointment data", Error = ex.Message });
            }
        }


        [HttpPost("BookAppointment")]
        public IActionResult BookAppointment(Appointment appointment)
        {
            
            if (appointment != null)
            {
                if (appointment.ClientIdNumber == "00000000000")
                {
                    return BadRequest();
                }
                Console.WriteLine(appointment.UniqueNumber);
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
                Console.WriteLine($"Removing appointment: {appointment.Id}, {appointment.UniqueNumber}, {appointment.IdNumber}");

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

        [HttpGet("getDoctordataBytdid")]
        public IActionResult getDoctordataBytdid(string IdNumber, string tdId)
        {
            try
            {
                // Assuming tdId is stored in the UniqueNumber property of the Appointment model
                var data = db.tblAppointment
                    .Where(x => x.IdNumber.Equals(IdNumber) && x.UniqueNumber.Equals(tdId))
                    .ToList();

                if (data == null || data.Count == 0)
                    return NotFound(new { message = "No Data Found" });

                var count = data.Count;

                return Ok(new { data, Count = count });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(500, new { Message = "Error retrieving appointment data", Error = ex.Message });
            }
        }


        [HttpPost("ClientBookAppointment")]
        public IActionResult ClientBookAppointment(Appointment appointment)
        {
            if (appointment != null)
            {
                if (appointment.ClientIdNumber == "00000000000")
                {
                    return BadRequest();
                }
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
