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
    (1, 8, 12, 2),
    (1, 14, 17, 2),
    (2, 8, 12, 2),
    (2, 14, 17, 2),
    (3, 8, 12, 2),
    (3, 14, 17, 2),
    (4, 8, 12, 2),
    (4, 14, 17, 2),
    (5, 8, 12, 2),
    (5, 14, 17, 2),
    (1, 8, 12, 3),
    (2, 8, 12, 3),
    (3, 8, 12, 3),
    (4, 8, 12, 3),
    (5, 8, 12, 3),
    (1, 8, 12, 4),
    (1, 14, 17, 4),
    (2, 8, 12, 4),
    (2, 14, 17, 4),
    (3, 8, 12, 4),
    (3, 14, 17, 4),
    (4, 8, 12, 4),
    (4, 14, 17, 4),
    (5, 8, 12, 4),
    (5, 14, 17, 4),
    (1, 8, 12, 5),
    (1, 14, 15, 5),
    (2, 8, 12, 5),
    (2, 14, 15, 5),
    (3, 8, 12, 5),
    (3, 14, 15, 5),
    (4, 8, 12, 5),
    (4, 14, 15, 5),
    (5, 8, 12, 5),
    (5, 14, 15, 5),
    (1, 8, 12, 6),
    (1, 12, 17, 6),
    (2, 8, 12, 6),
    (2, 12, 17, 6),
    (3, 8, 12, 6),
    (3, 12, 17, 6),
    (4, 8, 12, 6),
    (4, 12, 17, 6),
    (5, 8, 12, 6),
    (5, 12, 17, 6),
    (1, 14, 17, 7),
    (2, 14, 17, 7),
    (3, 14, 17, 7),
    (4, 14, 17, 7),
    (5, 14, 17, 7),
    (1, 8, 12, 8),
    (1, 12, 17, 8),
    (2, 8, 12, 8),
    (2, 12, 17, 8),
    (3, 8, 12, 8),
    (3, 12, 17, 8),
    (4, 8, 12, 8),
    (4, 12, 17, 8),
    (5, 8, 12, 8),
    (5, 12, 17, 8),
    (1, 8, 12, 9),
    (1, 12, 17, 9),
    (2, 8, 12, 9),
    (2, 12, 17, 9),
    (3, 8, 12, 9),
    (3, 12, 17, 9),
    (4, 8, 12, 9),
    (4, 12, 17, 9),
    (5, 8, 12, 9),
    (5, 12, 17, 9),
    (1, 8, 12, 10),
    (1, 12, 17, 10),
    (2, 8, 12, 10),
    (2, 12, 17, 10),
    (3, 8, 12, 10),
    (3, 12, 17, 10),
    (4, 8, 12, 10),
    (4, 12, 17, 10),
    (5, 8, 12, 10),
    (5, 12, 17, 10),
    (1, 8, 10, 11),
    (2, 8, 10, 11),
    (3, 8, 10, 11),
    (4, 8, 10, 11),
    (5, 8, 10, 11),
    (1, 8, 12, 12),
    (1, 12, 17, 12),
    (2, 8, 12, 12),
    (2, 12, 17, 12),
    (3, 8, 12, 12),
    (3, 12, 17, 12),
    (4, 8, 12, 12),
    (4, 12, 17, 12),
    (5, 8, 12, 12),
    (5, 12, 17, 12),
    (1, 12, 17, 13),
    (2, 12, 17, 13),
    (3, 12, 17, 13),
    (4, 12, 17, 13),
    (5, 12, 17, 13),
    (1, 8, 12, 14),
    (1, 12, 17, 14),
    (2, 8, 12, 14),
    (2, 12, 17, 14),
    (3, 8, 12, 14),
    (3, 12, 17, 14),
    (4, 8, 12, 14),
    (4, 12, 17, 14),
    (5, 8, 12, 14),
    (5, 12, 17, 14),
    (2, 12, 17, 15),
    (3, 12, 17, 15),
    (4, 12, 17, 15),
    (5, 12, 17, 15),
    (1, 8, 12, 16),
    (2, 8, 12, 16),
    (3, 8, 12, 16),
    (4, 8, 12, 16),
    (1, 8, 12, 17),
    (1, 12, 17, 17),
    (2, 8, 12, 17),
    (2, 12, 17, 17),
    (3, 8, 12, 17),
    (3, 12, 17, 17),
    (4, 8, 12, 17),
    (4, 12, 17, 17),
    (5, 8, 12, 17),
    (5, 12, 17, 17),
    (2, 8, 12, 18),
    (2, 12, 17, 18),
    (4, 8, 12, 18),
    (4, 12, 17, 18),
    (1, 8, 12, 19),
    (1, 12, 17, 19),
    (2, 8, 12, 19),
    (2, 12, 17, 19),
    (3, 8, 12, 19),
    (3, 12, 17, 19),
    (4, 8, 12, 19),
    (4, 12, 17, 19),
    (5, 8, 12, 19),
    (5, 12, 17, 19),
    (1, 8, 12, 20),
    (1, 12, 17, 20),
    (2, 8, 12, 20),
    (2, 12, 17, 20),
    (3, 8, 12, 20),
    (3, 12, 17, 20),
    (4, 8, 12, 20),
    (4, 12, 17, 20),
    (5, 8, 12, 20),
    (5, 12, 17, 20);

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
    (1, "2024-02-10T09:00:00", 4, 1, "Finalizada", NULL, 3000, NULL, 0, NULL, 1, 2),
    (1, "2024-03-15T11:00:00", 3, 1, "Finalizada", NULL, 3699, NULL, 0, NULL, 2, 3),
    (1, "2023-04-24T16:30:06", 4, 1, "Finalizada", NULL, 3699, NULL, 0, NULL, 2, 3),
    (2, "2023-04-24T16:30:05", 5, 1, "Finalizada", NULL, 3699, NULL, 0, NULL, 2, 4),
    (3, "2022-04-24T16:30:04", 2, 1, "Finalizada", NULL, 3699, NULL, 0, NULL, 2, 5),
    (3, "2024-05-24T16:30:03", 1, 1, "Finalizada", NULL, 3699, NULL, 0, NULL, 2, 5),
    (4, "2024-05-24T16:30:02", 5, 1, "Finalizada", NULL, 3699, NULL, 0, NULL, 1, 1),
    (5, "2024-05-24T16:30:01", 3, 1, "Finalizada", NULL, 3699, NULL, 0, NULL, 1, 6),
    (5, "2021-04-24T16:30:40", 5, 1, "Finalizada", NULL, 3699, NULL, 0, NULL, 1, 7),
    (1, "2024-05-02T13:45:00", 4, 17, "Finalizada", NULL, 1500, NULL, 0, NULL, 3, 7),
    (1, "2024-05-03T12:00:00", 1, 2, "Finalizada", NULL, 2500, NULL, 0, NULL, 1, 7),
    (1, '2024-06-04 11:00:00', 4, 2, 'Finalizada', NULL, 60, NULL, 0, 11, 2, 2),
    (1, '2024-06-06 13:00:00', 2, 4, 'Finalizada', NULL, 80, NULL, 0, 3, 4, 4),
    (1, '2024-06-08 15:00:00', 3, 6, 'Finalizada', NULL, 100, NULL, 0, NULL, 6, 6),
    (1, '2024-06-08 17:00:00', 5, 8, 'Finalizada', NULL, 120, NULL, 0, 9, 8, 8),
    (1, '2024-05-12 19:00:00', 1, 10, 'Finalizada', NULL, 140, NULL, 0, 7, 10, 10),
    (1, '2024-05-14 21:00:00', 4, 12, 'Finalizada', NULL, 160, NULL, 0, NULL, 12, 12),
    (1, '2024-05-16 23:00:00', 2, 14, 'Finalizada', NULL, 180, NULL, 0, NULL, 14, 14),
    (1, '2024-05-18 11:00:00', 3, 16, 'Finalizada', NULL, 200, NULL, 0, 14, 16, 16),
    (1, '2024-05-20 13:00:00', 5, 18, 'Finalizada', NULL, 220, NULL, 0, NULL, 11, 18),
    (1, '2024-05-22 15:00:00', 1, 20, 'Finalizada', NULL, 240, NULL, 0, 20, 10, 20),
    (1, '2024-05-24 17:00:00', 4, 2, 'Finalizada', NULL, 260, NULL, 0, NULL, 2, 1),
    (1, '2024-05-26 19:00:00', 2, 4, 'Finalizada', NULL, 280, NULL, 0, NULL, 4, 3),
    (1, '2024-05-28 21:00:00', 3, 6, 'Finalizada', NULL, 300, NULL, 0, 24, 6, 5),
    (1, '2024-05-30 23:00:00', 5, 8, 'Finalizada', NULL, 320, NULL, 0, 19, 8, 7),
    (1, '2024-05-02 11:00:00', 1, 10, 'Finalizada', NULL, 340, NULL, 0, NULL, 10, 9),
    (1, '2024-05-04 13:00:00', 4, 12, 'Finalizada', NULL, 360, NULL, 0, NULL, 12, 11),
    (1, '2024-05-06 15:00:00', 2, 14, 'Finalizada', NULL, 380, NULL, 0, NULL, 14, 13),
    (1, '2024-05-08 17:00:00', 3, 16, 'Finalizada', NULL, 400, NULL, 0, NULL, 16, 15),
    (1, '2024-05-10 19:00:00', 5, 18, 'Finalizada', NULL, 420, NULL, 0, 34, 14, 17),
    (1, '2024-05-12 21:00:00', 1, 20, 'Finalizada', NULL, 440, NULL, 0, 30, 15, 19);


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
    ),
    (
        "2024-05-28T20:03:14",
        1,
        "2024-05-28T21:00:00",
        "Buenos días, doctor. En realidad, me siento un poco preocupado por los síntomas que he estado teniendo últimamente.",
        1
    ),
    (
        "2024-05-28T20:05:32",
        1,
        "2024-05-28T21:00:00",
        "Entiendo, es importante que hablemos de eso. ¿Puedes contarme más sobre tus síntomas y desde cuándo los has estado experimentando?",
        8
    ),
    (
        "2024-05-28T20:10:43",
        1,
        "2024-05-28T21:00:00",
        "Sí, he tenido dolores de cabeza constantes y un malestar en el estómago que no parece desaparecer.",
        1
    ),
    (
        "2024-05-28T20:13:12",
        1,
        "2024-05-28T21:00:00",
        "Entiendo. ¿Has notado algún otro síntoma junto con estos?",
        8
    ),
    (
        "2024-05-28T20:20:04",
        1,
        "2024-05-28T21:00:00",
        "Bueno, también he tenido algo de fatiga y dificultad para dormir últimamente.",
        1
    ),
    (
        "2024-05-28T20:24:13",
        1,
        "2024-05-28T21:00:00",
        "Gracias por compartir eso. Voy a tomar nota de todo esto y vamos a discutirlo más durante nuestra consulta. ¿Hay algo más que quieras mencionar antes de que comencemos?",
        8
    ),
    (
        "2024-05-28T20:36:43",
        1,
        "2024-05-28T21:00:00",
        "No, creo que eso resume la mayoría de mis preocupaciones por ahora.",
        1
    ),
    (
        "2024-05-28T20:42:52",
        1,
        "2024-05-28T21:00:00",
        "Entendido. Estoy aquí para ayudarte y juntos encontraremos la mejor manera de abordar tus síntomas. ¿Te parece bien si comenzamos nuestra reunión en línea ahora?",
        8
    ),
    (
        "2024-05-28T20:45:32",
        1,
        "2024-05-28T21:00:00",
        "Sí, claro, doctor. Estoy listo cuando tú lo estés.",
        1
    ),
    (
        "2024-05-28T20:52:13",
        1,
        "2024-05-28T21:00:00",
        "Perfecto, nos vemos en la videollamada en unos momentos entonces.",
        8
    );

UPDATE user SET admin = 1 WHERE id = 3;

INSERT INTO benefit (name) VALUES ('Realizar reuniones con pacientes'), ('Visibilidad'), ('Mayor Visibilidad');
INSERT INTO plan_benefits_benefit VALUES (1, 1), (2, 1), (2, 2), (3,1), (3,2), (3,3);
