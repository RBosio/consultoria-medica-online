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
    plan (name, price)
VALUES
    ('Plan 1', 12000),
    ('Plan 2', 20000);

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
    medical_record (datetime, detail)
VALUES
    ("2024-01-20T20:00:00", "Detalle");

INSERT INTO
    meeting (
        userId,
        startDatetime,
        doctorId,
        status
    )
VALUES
    (1, "2024-01-17T10:30:00", 1, "Pendiente"),
    (1, "2024-01-23T09:30:00", 1, "Pendiente"),
    (1, "2024-02-17T18:00:00", 1, "Pendiente"),
    (1, "2024-02-09T09:00:00", 1, "Finalizada"),
    (1, "2024-02-18T14:30:00", 1, "Cancelada"),
    (1, "2024-04-24T14:00:00", 1, "Finalizada"),
    (1, "2024-04-19T14:45:00", 1, "Finalizada"),
    (1, "2024-04-29T09:00:00", 1, "Finalizada"),
    (1, "2024-05-10T16:30:00", 1, "Cancelada");

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