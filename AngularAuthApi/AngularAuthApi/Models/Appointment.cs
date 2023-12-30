﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AngularAuthApi.Models
{
    public class Appointment
    {
        [Key]
        public int Id { get; set; }
        public string? DoctorName
        {
            get; set;
        }
        public string? PatientName
        {
            get; set;
        }
        public string UniqueNumber { get; set; } 
        public string? Status { get; set; }

        public string IdNumber { get; set; } // Added IdNumber property

    }
}
