INSERT INTO
    speciality (name)
VALUES
    ('Psicología'),
    ('Cardiología'),
    ('Dermatología'),
    ('Neurología'),
    ('Oftalmología'),
    ('Oncología'),
    ('Pediatría'),
    ('Endocrinología'),
    ('Ginecología'),
    ('Urología'),
    ('Traumatología'),
    ('Nutriología'),
    ('Anestesiología'),
    ('Radiología'),
    ('Hematología'),
    ('Infectología'),
    ('Nefrología'),
    ('Otorrinolaringología'),
    ('Reumatología'),
    ('Medicina General'),
    ('Ortopedia');

INSERT INTO
    health_insurance (name, discount)
VALUES
    ('OSDE 210', 0.20),
    ('OSDE 310', 0.30),
    ('OSDE 410', 0.45),
    ('OSDE 450', 0.50),
    ('OSDE 510', 0.60),
    ('SWISS MEDICAL SMG30', 0.35),
    ('SWISS MEDICAL SMG40', 0.50),
    ('SWISS MEDICAL SMG50', 0.55),
    ('SWISS MEDICAL SMG60', 0.65),
    ('SWISS MEDICAL SMG70', 0.70),
    ('HOSPITAL ALEMÁN L300', 0.30),
    ('HOSPITAL ALEMÁN L600', 0.40),
    ('HOSPITAL ALEMÁN L700', 0.45),
    ('MEDICUS AZUL', 0.25),
    ('MEDICUS CELESTE', 0.25),
    ('MEDICUS MEDICUS 18/35', 0.30),
    ('MEDICUS FAMILY', 0.30),
    ('MEDICUS FAMILY FLEX', 0.45),
    ('MEDICUS PLAN MUJER', 0.45),
    ('MEDICUS INTEGRA 2', 0.50),
    ('MEDICUS INTEGRA 2 FLEX', 0.50),
    ('MEDICUS CONECTA', 0.60),
    ('GALENO 220', 0.20),
    ('GALENO 330', 0.30),
    ('GALENO 440', 0.40),
    ('GALENO 550', 0.55),
    ('GALENO 18-25', 0.45),        
    ('OMINT CLÁSICO', 0.35),
    ('OMINT PREMIUM', 0.45),
    ('OMINT GLOBAL', 0.50),
    ('OMINT GÉNESIS', 0.50),
    ('OMINT MIDOC', 0.35),
    ('OSPOCE Mi 500', 0.25),
    ('OSPOCE Mi 600', 0.25),
    ('OSPOCE Mi 700', 0.30),
    ('OSPOCE Mi 800', 0.35),
    ('OSPOCE Mi 900', 0.40),
    ('OSPOCE Mi 950', 0.40),
    ('OSPOCE Mi 1000', 0.55),
    ('OSPOCE Mi 2000', 0.60),
    ('SANCOR SALUD F700', 0.20),
    ('SANCOR SALUD F800 Digital Flex', 0.25),
    ('SANCOR SALUD F800', 0.30),
    ('SANCOR SALUD S1000 Digital Flex', 0.35),
    ('SANCOR SALUD 1000', 0.40),
    ('SANCOR SALUD 1500', 0.45),
    ('SANCOR SALUD 3000', 0.50),
    ('SANCOR SALUD 3500', 0.50),
    ('SANCOR SALUD 4000', 0.55),
    ('SANCOR SALUD 4500', 0.60),
    ('SANCOR SALUD 5000 EXCLUSIVE', 0.65),
    ('SANCOR SALUD 6000 EXCLUSIVE', 0.65),
    ('PREVENCIÓN SALUD A1', 0.25),
    ('PREVENCIÓN SALUD A2', 0.35),
    ('PREVENCIÓN SALUD A4', 0.45),
    ('PREVENCIÓN SALUD A5', 0.55),
    ('WILLIAM HOPE PLATA', 0.25),
    ('WILLIAM HOPE ORO', 0.50),
    ('OPDEA 03', 0.25),
    ('OPDEA 04', 0.30),
    ('OPDEA 10', 0.35),
    ('OPDEA 12', 0.40),
    ('OPDEA 15', 0.45),
    ('OSPESA', 0.40),
    ('OSPJN', 0.25),
    ('IOSFA', 0.20);

INSERT INTO
    plan (name, price, planId)
VALUES
    ('Básico', 12000, "asdasd-asd-asdasasdas"),
    ('Avanzado', 20000, "adsda-sadasdas-dasdsad"),
    ('Premium', 27000, "adsda-sadasdas-dasdsad");

INSERT INTO
    schedule (day, start_hour, end_hour, doctorId)
VALUES
    (0, 14, 18, 1),
    (1, 14, 18, 1),
    (2, 14, 18, 1),
    (3, 14, 18, 1),
    (4, 14, 18, 1),
    (5, 9, 12, 1),
    (5, 14, 18, 1),
    (6, 14, 18, 1);

INSERT INTO
    medical_record (datetime, detail, observations)
VALUES
    ("2024-02-10T09:45:00", "Astigmatismo de grado menor", NULL),
    ("2024-03-15T12:00:00", "Posible rotura de ligamentos cruzados", "Ir a consultorio físico para exámenes"),
    ("2024-05-02T14:00:00", "Bloqueo en rama derecha del corazón", "Realizar Ecocardiograma y Ergometría en un plazo menor a 2 semanas"),
    ("2024-04-24T17:30:00", "Avance positivo en la recuperación de los ligamentos cruzados", NULL);

INSERT INTO
    meeting (
        userId,
        startDatetime,
        doctorId,
        medicalRecordId,
        status,
        price,
        healthInsuranceId,
        specialityId
    )
VALUES
    (1, "2024-02-10T09:00:00", 1, 1, "Finalizada", 3000, 1, 2),
    (1, "2024-03-15T11:00:00", 1, 2, "Finalizada", 3699, 2, 3),
    (1, "2023-04-24T16:30:06", 1, null, "Finalizada", 3699, 2, 3),
    (2, "2023-04-24T16:30:05", 1, null, "Finalizada", 3699, 2, 4),
    (3, "2022-04-24T16:30:04", 1, null, "Finalizada", 3699, 2, 5),
    (3, "2024-05-24T16:30:03", 1, null, "Finalizada", 3699, 2, 5),
    (4, "2024-05-24T16:30:02", 1, null, "Finalizada", 3699, 1, 1),
    (5, "2024-05-24T16:30:01", 1, null, "Finalizada", 3699, 1, 6),
    (5, "2021-04-24T16:30:40", 1, null, "Finalizada", 3699, 1, 7),
    (1, "2024-05-02T13:45:00", 17, 4, "Finalizada", 1500, 3, 7),
    (1, "2024-05-03T12:00:00", 1, null, "Pagada", 2500, 1, 7);

INSERT INTO
    comment (
        datetime,
        meetingUserId,
        meetingStartDatetime,
        comment,
        userCommentId
    )
VALUES
    (
        "2024-01-15T14:32:48",
        1,
        "2024-02-10T09:00:00",
        "Hola, ¿cómo le va?",
        1
    ),
    (
        "2024-01-15T15:14:26",
        1,
        "2024-02-10T09:00:00",
        "Buenas! En unos minutos comenzamos la reunión",
        2
    );

UPDATE user SET admin = 1 WHERE id = 3;

INSERT INTO benefit (name) VALUES ('Realizar reuniones con pacientes'), ('Visibilidad'), ('Mayor Visibilidad');
INSERT INTO plan_benefits_benefit VALUES (1, 1), (2, 1), (2, 2), (3,1), (3,2), (3,3);
