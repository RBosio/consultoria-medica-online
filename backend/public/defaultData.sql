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
    ("2024-04-24T17:30:00", "Avance positivo en la recuperación de los ligamentos cruzados", NULL),
    ('2023-05-01T10:30:00', 'Consulta general', 'El paciente presenta buen estado general. Sin signos de alarma. Se recomienda control en 6 meses.'),
    ('2023-06-15T14:00:00', 'Revisión de control', 'El paciente ha mantenido una dieta balanceada. Peso y talla dentro de parámetros normales.'),
    ('2023-07-20T09:45:00', 'Examen de sangre', 'Resultados de laboratorio dentro de los valores normales. Se sugiere continuar con el tratamiento actual.'),
    ('2023-08-05T11:30:00', 'Chequeo de rutina', 'Sin cambios significativos desde la última visita. El paciente reporta sentirse bien.'),
    ('2023-09-10T16:00:00', 'Consulta por dolor de cabeza', 'El paciente presenta cefalea tensional. Se prescribe analgésico y se recomienda descanso.'),
    ('2023-10-22T13:15:00', 'Consulta por dolor abdominal', 'Se detecta gastroenteritis leve. Se sugiere hidratación y dieta blanda. Revisar en una semana.'),
    ('2023-11-18T08:00:00', 'Chequeo postoperatorio', 'La herida quirúrgica está cicatrizando adecuadamente. No hay signos de infección. Control en 2 semanas.'),
    ('2023-12-30T15:30:00', 'Consulta por tos persistente', 'El paciente presenta síntomas de bronquitis. Se prescribe antibiótico y se recomienda reposo.'),
    ('2024-01-12T10:00:00', 'Consulta de seguimiento', 'El paciente ha mejorado significativamente. Continuar con el tratamiento prescrito.'),
    ('2024-02-25T11:45:00', 'Consulta por dolor muscular', 'El paciente refiere dolor muscular después de actividad física intensa. Se sugiere fisioterapia y antiinflamatorio.'),
    ('2024-03-10T10:15:00', 'Chequeo anual', 'El paciente se encuentra en buenas condiciones. Todos los valores dentro de los rangos normales.'),
    ('2024-04-05T09:00:00', 'Consulta por dolor de garganta', 'El paciente presenta faringitis leve. Se prescribe antiinflamatorio y gárgaras con agua salina.'),
    ('2024-04-20T12:30:00', 'Revisión de control', 'El paciente ha perdido peso, pero se encuentra en buen estado. Se recomienda mantener la dieta actual.'),
    ('2024-05-10T14:45:00', 'Consulta por alergia', 'El paciente presenta síntomas de alergia estacional. Se prescribe antihistamínico.'),
    ('2024-06-15T08:15:00', 'Consulta por dolor de espalda', 'El paciente refiere dolor lumbar. Se sugiere reposo y fisioterapia. Revisar en dos semanas.'),
    ('2024-07-01T16:00:00', 'Consulta post-vacacional', 'El paciente ha regresado de vacaciones sin complicaciones de salud. Se encuentra en buen estado general.'),
    ('2024-08-10T10:45:00', 'Consulta por insomnio', 'El paciente reporta dificultad para dormir. Se recomienda higiene del sueño y, si persiste, posible medicación.'),
    ('2024-09-05T11:30:00', 'Chequeo de rutina', 'El paciente se encuentra bien, sin cambios significativos desde la última visita. Control en seis meses.'),
    ('2024-10-15T13:00:00', 'Consulta por mareos', 'El paciente reporta mareos ocasionales. Se sugiere monitorización de la presión arterial y revisión neurológica.'),
    ('2024-11-20T09:30:00', 'Consulta por gripe', 'El paciente presenta síntomas de gripe común. Se recomienda reposo, hidratación y paracetamol.'),
    ('2024-12-01T15:45:00', 'Consulta prenatal', 'El paciente está en su tercer trimestre de embarazo. Todo está progresando bien. Control en cuatro semanas.'),
    ('2024-12-30T10:15:00', 'Consulta postnatal', 'La paciente y el recién nacido se encuentran en buen estado. Se recomienda seguimiento pediátrico y postnatal.'),
    ('2025-01-10T08:30:00', 'Consulta por dolor de muelas', 'El paciente presenta dolor dental. Se sugiere consulta con el odontólogo para tratamiento adecuado.'),
    ('2025-02-18T12:00:00', 'Chequeo preventivo', 'El paciente se encuentra en buen estado general. Se recomienda mantener hábitos saludables.'),
    ('2025-03-05T14:30:00', 'Consulta por dermatitis', 'El paciente presenta una erupción cutánea. Se prescribe crema tópica y evitar alergenos conocidos.'),
    ('2025-04-12T11:45:00', 'Consulta por ansiedad', 'El paciente reporta síntomas de ansiedad. Se sugiere terapia cognitivo-conductual y posibles medicamentos ansiolíticos.'),
    ('2025-05-20T13:15:00', 'Consulta por hipertensión', 'El paciente presenta presión arterial elevada. Se ajusta la medicación y se recomienda monitoreo regular.'),
    ('2025-06-01T09:00:00', 'Consulta por infeccion urinaria', 'El paciente presenta síntomas de infección urinaria. Se prescribe antibiótico y se recomienda hidratación.'),
    ('2025-07-08T15:30:00', 'Chequeo postoperatorio', 'El paciente se recupera bien de la cirugía. No hay complicaciones. Control en una semana.'),
    ('2025-08-15T10:00:00', 'Consulta por fatiga', 'El paciente reporta fatiga crónica. Se sugiere evaluación de tiroides y análisis de sangre.'),
    ('2025-09-10T14:45:00', 'Consulta por dolor en las articulaciones', 'El paciente presenta dolor articular. Se sugiere antiinflamatorio y consulta con reumatólogo.'),
    ('2025-10-22T11:00:00', 'Consulta por migrañas', 'El paciente presenta migrañas frecuentes. Se prescribe medicación específica y se recomienda seguimiento.'),
    ('2025-11-15T13:30:00', 'Chequeo pediátrico', 'El niño se encuentra en buen estado general. Peso y talla dentro de los parámetros normales para su edad.'),
    ('2025-12-05T09:15:00', 'Consulta por anemia', 'El paciente presenta síntomas de anemia. Se prescribe suplemento de hierro y dieta rica en hierro.'),
    ('2026-01-08T16:00:00', 'Chequeo cardiaco', 'El paciente se encuentra en buen estado. ECG y otros exámenes dentro de los parámetros normales.'),
    ('2026-02-12T10:30:00', 'Consulta por acné', 'El paciente presenta acné moderado. Se prescribe tratamiento tópico y se recomienda control en un mes.'),
    ('2026-03-20T12:15:00', 'Consulta por estreñimiento', 'El paciente reporta estreñimiento crónico. Se recomienda aumentar la fibra en la dieta y ejercicio regular.'),
    ('2026-04-25T11:45:00', 'Consulta por asma', 'El paciente presenta síntomas de asma. Se ajusta la medicación y se recomienda seguimiento en tres meses.'),
    ('2026-05-30T13:00:00', 'Chequeo de rutina', 'El paciente está en buen estado general. Sin signos de alarma. Control en seis meses.'),
    ('2026-06-15T09:30:00', 'Consulta por infección de oído', 'El paciente presenta otitis media. Se prescribe antibiótico y analgésico.'),
    ('2026-07-20T14:15:00', 'Consulta por pérdida de peso', 'El paciente ha perdido peso de manera involuntaria. Se sugiere evaluación metabólica y seguimiento nutricional.');

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

INSERT INTO meeting (
    userId,
    startDatetime, 
    rate, 
    doctorId, 
    status, 
    tpc, 
    price, 
    motive, 
    repr, 
    medicalRecordId, 
    healthInsuranceId, 
    specialityId
    )
VALUES
    (1, '2024-06-03 10:00:00', 3, 1, 'Pagada', NULL, 50, NULL, 0, 12, 1, 1),
    (1, '2024-06-04 11:00:00', 4, 2, 'Finalizada', NULL, 60, NULL, 0, 11, 2, 2),
    (1, '2024-06-05 12:00:00', 5, 3, 'Pagada', NULL, 70, NULL, 0, 38, 3, 3),
    (1, '2024-06-06 13:00:00', 2, 4, 'Finalizada', NULL, 80, NULL, 0, 3, 4, 4),
    (1, '2024-06-07 14:00:00', 1, 5, 'Pagada', NULL, 90, NULL, 0, 6, 5, 5),
    (1, '2024-06-08 15:00:00', 3, 6, 'Finalizada', NULL, 100, NULL, 0, NULL, 6, 6),
    (1, '2024-06-09 16:00:00', 4, 7, 'Pagada', NULL, 110, NULL, 0, NULL, 7, 7),
    (1, '2024-06-10 17:00:00', 5, 8, 'Finalizada', NULL, 120, NULL, 0, 9, 8, 8),
    (1, '2024-06-11 18:00:00', 2, 9, 'Pagada', NULL, 130, NULL, 0, NULL, 9, 9),
    (1, '2024-06-12 19:00:00', 1, 10, 'Finalizada', NULL, 140, NULL, 0, 7, 10, 10),
    (1, '2024-06-13 20:00:00', 3, 11, 'Pagada', NULL, 150, NULL, 0, NULL, 11, 11),
    (1, '2024-06-14 21:00:00', 4, 12, 'Finalizada', NULL, 160, NULL, 0, NULL, 12, 12),
    (1, '2024-06-15 22:00:00', 5, 13, 'Pagada', NULL, 170, NULL, 0, NULL, 13, 13),
    (1, '2024-06-16 23:00:00', 2, 14, 'Finalizada', NULL, 180, NULL, 0, NULL, 14, 14),
    (1, '2024-06-17 10:00:00', 1, 15, 'Pagada', NULL, 190, NULL, 0, 10, 15, 15),
    (1, '2024-06-18 11:00:00', 3, 16, 'Finalizada', NULL, 200, NULL, 0, 14, 16, 16),
    (1, '2024-06-19 12:00:00', 4, 17, 'Pagada', NULL, 210, NULL, 0, NULL, 12, 17),
    (1, '2024-06-20 13:00:00', 5, 18, 'Finalizada', NULL, 220, NULL, 0, NULL, 11, 18),
    (1, '2024-06-21 14:00:00', 2, 19, 'Pagada', NULL, 230, NULL, 0, 32, 11, 19),
    (1, '2024-06-22 15:00:00', 1, 20, 'Finalizada', NULL, 240, NULL, 0, 20, 10, 20),
    (1, '2024-06-23 16:00:00', 3, 1, 'Pagada', NULL, 250, NULL, 0, 21, 1, 21),
    (1, '2024-06-24 17:00:00', 4, 2, 'Finalizada', NULL, 260, NULL, 0, NULL, 2, 1),
    (1, '2024-06-25 18:00:00', 5, 3, 'Pagada', NULL, 270, NULL, 0, 36, 3, 2),
    (1, '2024-06-26 19:00:00', 2, 4, 'Finalizada', NULL, 280, NULL, 0, NULL, 4, 3),
    (1, '2024-06-27 20:00:00', 1, 5, 'Pagada', NULL, 290, NULL, 0, 28, 5, 4),
    (1, '2024-06-28 21:00:00', 3, 6, 'Finalizada', NULL, 300, NULL, 0, 24, 6, 5),
    (1, '2024-06-29 22:00:00', 4, 7, 'Pagada', NULL, 310, NULL, 0, 22, 7, 6),
    (1, '2024-06-30 23:00:00', 5, 8, 'Finalizada', NULL, 320, NULL, 0, 19, 8, 7),
    (1, '2024-07-01 10:00:00', 2, 9, 'Pagada', NULL, 330, NULL, 0, 18, 9, 8),
    (1, '2024-07-02 11:00:00', 1, 10, 'Finalizada', NULL, 340, NULL, 0, NULL, 10, 9),
    (1, '2024-07-03 12:00:00', 3, 11, 'Pagada', NULL, 350, NULL, 0, NULL, 11, 10),
    (1, '2024-07-04 13:00:00', 4, 12, 'Finalizada', NULL, 360, NULL, 0, NULL, 12, 11),
    (1, '2024-07-05 14:00:00', 5, 13, 'Pagada', NULL, 370, NULL, 0, NULL, 13, 12),
    (1, '2024-07-06 15:00:00', 2, 14, 'Finalizada', NULL, 380, NULL, 0, NULL, 14, 13),
    (1, '2024-07-07 16:00:00', 1, 15, 'Pagada', NULL, 390, NULL, 0, NULL, 15, 14),
    (1, '2024-07-08 17:00:00', 3, 16, 'Finalizada', NULL, 400, NULL, 0, NULL, 16, 15),
    (1, '2024-07-09 18:00:00', 4, 17, 'Pagada', NULL, 410, NULL, 0, NULL, 12, 16),
    (1, '2024-07-10 19:00:00', 5, 18, 'Finalizada', NULL, 420, NULL, 0, 34, 14, 17),
    (1, '2024-07-11 20:00:00', 2, 19, 'Pagada', NULL, 430, NULL, 0, NULL, 9, 14),
    (1, '2024-07-12 21:00:00', 1, 20, 'Finalizada', NULL, 440, NULL, 0, 30, 15, 19);


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
