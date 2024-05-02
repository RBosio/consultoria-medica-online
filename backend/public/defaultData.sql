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
        price,
        status
    )
VALUES
    (1, "2024-05-10T20:00:00", 1, "2024-01-20T20:00:12", 200, "Pagada"),
    (1, "2024-05-12T14:00:00", 1, "2024-01-20T20:00:13", 200, "Pagada"),
    (1, "2024-05-14T18:00:00", 1, "2024-01-20T20:00:14", 200, "Pagada"),
    (1, "2024-05-09T09:00:00", 1, null, 200, "Finalizada"),
    (1, "2024-05-18T14:30:00", 1, null, 200, "Cancelada"),
    (1, "2024-05-24T14:00:00", 1, null, 200, "Finalizada"),
    (1, "2024-05-19T14:45:00", 1, null, 200, "Finalizada"),
    (1, "2024-05-29T09:10:00", 1, null, 200, "Finalizada"),
    (1, "2024-05-10T16:20:00", 1, null, 200, "Cancelada"),
    (1, "2024-05-18T14:40:00", 1, null, 200, "Cancelada"),
    (1, "2024-05-24T14:10:00", 1, null, 200, "Finalizada"),
    (1, "2024-05-19T14:10:00", 1, null, 200, "Finalizada"),
    (1, "2024-05-29T09:20:00", 1, null, 200, "Finalizada"),
    (1, "2024-05-10T16:10:00", 1, null, 200, "Cancelada");

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
        "2024-05-10T20:00:00",
        "Comentario 1",
        1
    ),
    (
        "2024-01-15T15:14:26",
        1,
        "2024-05-10T20:00:00",
        "Comentario 2",
        2
    );

UPDATE user SET admin = 1 WHERE id = 3;

INSERT INTO benefit (name) VALUES ('Visibilidad normal'), ('Mayor llegada a los usuarios'), ('Visibilidad muy alta');
INSERT INTO plan_benefits_benefit VALUES (1, 1), (1, 2), (2, 2), (2, 3);
