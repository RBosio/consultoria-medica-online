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
    ('OSDE', 0.60),
    ('OSDE', 0.30),
    ('OSDE', 0.20),
    ('IOSFA', 0.20),
    ('SWISS MEDICAL', 0.35),
    ('GALENO', 0.30),
    ('HOSPITAL ALEMÁN', 0.25),
    ('MEDICUS', 0.30),
    ('OMINT', 0.35),
    ('OSPOCE', 0.40),
    ('SANCOR SALUD', 0.35),
    ('PREVENCIÓN SALUD', 0.25),
    ('WILLIAM HOPE', 0.20),
    ('OSPJN', 0.25),
    ('OPDEA', 0.30),
    ('OSPESA', 0.40);

INSERT INTO
    plan (name, price, planId)
VALUES
    ('Plan 1', 12000, "asdasd-asd-asdasasdas"),
    ('Plan 2', 20000, "adsda-sadasdas-dasdsad");

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

INSERT INTO benefit (name) VALUES ('Visibilidad normal'), ('Mayor llegada a los usuarios'), ('Visibilidad muy alta');
INSERT INTO plan_benefits_benefit VALUES (1, 1), (1, 2), (2, 2), (2, 3);
