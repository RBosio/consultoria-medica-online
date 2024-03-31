INSERT INTO
    country (name)
VALUES
    ('Argentina'),
    ('Brasil');

INSERT INTO
    province (name, countryId)
VALUES
    ('Santa Fe', 1),
    ('Buenos Aires', 1);

INSERT INTO
    city (zipCode, name, provinceId)
VALUES
    ('1000', 'Buenos Aires', 2),
    ('2000', 'Rosario', 1),
    ('3000', 'Santa Fe', 1);

INSERT INTO
    speciality (name)
VALUES
    ('Psicologia'),
    ('Cardiologia');

INSERT INTO
    health_insurance (name, discount)
VALUES
    ('OSDE', 0.30),
    ('IOSFA', 0.20);

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
    ("2024-01-20T20:00:00", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:01", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:02", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:03", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:04", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:05", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:06", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:07", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:08", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:09", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:10", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:11", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:12", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:13", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:14", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:15", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:16", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:17", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:18", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:19", "Detalle", "Observaciones"),
    ("2024-01-20T20:00:20", "Detalle", "Observaciones");

INSERT INTO
    meeting (
        userId,
        startDatetime,
        doctorId,
        medicalRecordDatetime,
        status
    )
VALUES
    (1, "2024-01-17T10:30:00", 1, "2024-01-20T20:00:12", "Pendiente"),
    (1, "2024-01-23T09:30:00", 1, "2024-01-20T20:00:13", "Pendiente"),
    (1, "2024-02-17T18:00:00", 1, "2024-01-20T20:00:14", "Pendiente"),
    (1, "2024-02-09T09:00:00", 1, "2024-01-20T20:00:15", "Finalizada"),
    (1, "2024-02-18T14:30:00", 1, "2024-01-20T20:00:16", "Cancelada"),
    (1, "2024-04-24T14:00:00", 1, "2024-01-20T20:00:17", "Finalizada"),
    (1, "2024-04-19T14:45:00", 1, "2024-01-20T20:00:18", "Finalizada"),
    (1, "2024-04-29T09:00:00", 1, "2024-01-20T20:00:19", "Finalizada"),
    (1, "2024-05-10T16:30:00", 1, "2024-01-20T20:00:20", "Cancelada");

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
        "2024-01-17T10:30:00",
        "Comentario 1",
        1
    ),
    (
        "2024-01-15T15:14:26",
        1,
        "2024-01-17T10:30:00",
        "Comentario 2",
        2
    );