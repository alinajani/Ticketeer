SELECT
  'DROP TABLE '
  || TABLE_NAME
  || ' CASCADE CONSTRAINTS;'
FROM
  USER_TABLES;

DROP TABLE ORGANIZERS CASCADE CONSTRAINTS;

DROP TABLE PERFORMER_TYPE CASCADE CONSTRAINTS;

DROP TABLE COUNTRIES CASCADE CONSTRAINTS;

DROP TABLE LOCATIONS CASCADE CONSTRAINTS;

DROP TABLE VENUES CASCADE CONSTRAINTS;

DROP TABLE PERFORMERS CASCADE CONSTRAINTS;

DROP TABLE EVENT_CATEGORY CASCADE CONSTRAINTS;

DROP TABLE EVENTS CASCADE CONSTRAINTS;

DROP TABLE TICKETS CASCADE CONSTRAINTS;

DROP TABLE SEATS CASCADE CONSTRAINTS;

DROP TABLE USERS CASCADE CONSTRAINTS;

DROP TABLE TRANSACTIONS CASCADE CONSTRAINTS;

CREATE TABLE EVENT_CATEGORY (
  EVENT_CATEGORY_ID INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  EVENT_CATEGORY_NAME VARCHAR2(255) NOT NULL
);

CREATE TABLE ORGANIZERS (
  ORGANIZER_ID INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  ORGANIZER_NAME VARCHAR2(255) NOT NULL
);

insert into organizers (organizer_name) values ('sample');
select * from organizers;

CREATE TABLE PERFORMER_TYPE (
  PERFORMER_TYPE_ID INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  TYPE_NAME VARCHAR2(255) NOT NULL
);

CREATE TABLE PERFORMER_TYPE_A (
  PERFORMER_TYPE_A_ID INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  PERFORMER_TYPE_A_NAME VARCHAR2(255) NOT NULL
);

CREATE TABLE PERFORMER_TYPE_B (
  PERFORMER_TYPE_B_ID INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  PERFORMER_TYPE_B_NAME VARCHAR2(255) NOT NULL
);

CREATE TABLE COUNTRIES (
  COUNTRY_ID INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  COUNTRY_NAME VARCHAR(255) NOT NULL
);

CREATE TABLE LOCATIONS (
  LOCATION_ID INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  LOCATION_NAME VARCHAR(255) NOT NULL,
  COUNTRY_ID INT NOT NULL,
  CONSTRAINT COUNTRY_FK FOREIGN KEY (COUNTRY_ID) REFERENCES COUNTRIES (COUNTRY_ID)
);

CREATE TABLE USERS(
  USER_ID INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  USERNAME VARCHAR(255),
  EMAIL VARCHAR(255) CHECK (EMAIL LIKE '%@%'),
  PHONE_NUMBER INT CHECK (LENGTH(PHONE_NUMBER)<16),
  PASSWORD VARCHAR(255) CHECK (LENGTH(PASSWORD)>5),
  CITY_STATE_COUNTRY VARCHAR(255),
  NUM_OF_TICKETS_BOOKED INT
);

CREATE TABLE PERFORMERS (
  PERFORMER_ID INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  PERFORMER_NAME VARCHAR(255),
  PERFORMER_TYPE INT,
  CONSTRAINT PERFORMER_TYPE_FK FOREIGN KEY (PERFORMER_TYPE) REFERENCES PERFORMER_TYPE (PERFORMER_TYPE)
);

CREATE TABLE EVENTS (
  EVENT_ID INT PRIMARY KEY,
  EVENT_NAME VARCHAR(255) NOT NULL,
  VENUE_ID INT NOT NULL,
  EVENT_DATE DATE NOT NULL,
  START_TIME VARCHAR(255) NOT NULL,
  END_TIME VARCHAR(255) NOT NULL,
  ORGANIZER_ID INT NOT NULL,
  PERFORMER_ID INT NOT NULL,
  EVENT_CATEGORY_ID INT NOT NULL,
  NUM_OF_TICKETS INT NOT NULL,
  NUM_OF_VIP_TICKETS INT NOT NULL,
  NUM_OF_GENERAL_TICKETS INT NOT NULL,
  CONSTRAINT VENUE_FK FOREIGN KEY (VENUE_ID) REFERENCES VENUES (VENUE_ID),
  CONSTRAINT ORGANIZER_FK FOREIGN KEY (ORGANIZER_ID) REFERENCES ORGANIZERS (ORGANIZER_ID),
  CONSTRAINT PERFORMER_FK FOREIGN KEY (PERFORMER_ID) REFERENCES PERFORMERS (PERFORMER_ID),
  CONSTRAINT EVENT_CATEGORY_FK FOREIGN KEY (EVENT_CATEGORY_ID) REFERENCES EVENT_CATEGORY (EVENT_CATEGORY_ID)
);

--autoincrement of events, it needs to be done in a sequence and not within the table itself because this trigger must occur before the trigger
--that creates the tickets, so it needs the event_ID and both occur before the row gets added in table.
CREATE SEQUENCE EVENT_ID_SEQ INCREMENT BY 1 START WITH 1;

DROP SEQUENCE EVENT_ID_SEQ;

CREATE OR REPLACE TRIGGER EVENT_ID_CONTROL BEFORE
  INSERT ON EVENTS FOR EACH ROW
BEGIN
  SELECT
    EVENT_ID_SEQ.NEXTVAL INTO :NEW.EVENT_ID
  FROM
    DUAL;
END;
/

INSERT INTO EVENTS (
  EVENT_NAME,
  VENUE_ID,
  EVENT_DATE,
  START_TIME,
  END_TIME,
  ORGANIZER_ID,
  PERFORMER_ID,
  EVENT_CATEGORY_ID,
  NUM_OF_TICKETS,
  NUM_OF_VIP_TICKETS,
  NUM_OF_GENERAL_TICKETS
) VALUES (
  'Random Concert',
  1,
  TO_DATE('2023-10-31', 'YYYY-MM-DD'),
  TO_TIMESTAMP('15:00:00', 'HH24:MI:SS'),
  TO_TIMESTAMP('18:00:00', 'HH24:MI:SS'),
  1,
  1,
  1,
  5,
  1,
  1
);

SELECT
  *
FROM
  EVENTS;

SELECT
  *
FROM
  TICKETS;

CREATE OR REPLACE TRIGGER TICKET_CREATION_TRIGGER BEFORE
  INSERT ON EVENTS FOR EACH ROW
DECLARE
  N INT := 0;
BEGIN
  WHILE N < :NEW.NUM_OF_TICKETS LOOP
    INSERT INTO TICKETS (
      EVENT_ID,
      TICKET_TYPE,
      VENUE_ID,
      BOOKED
    ) VALUES (
      :NEW.EVENT_ID,
      1,
      :NEW.VENUE_ID,
      'n'
    );
    N := N +1;
  END LOOP;
END;

CREATE OR REPLACE TRIGGER TICKET_UPDATION_TRIGGER BEFORE
UPDATE ON EVENTS FOR EACH ROW DECLARE CURSOR NUM_OF_TICKS IS
SELECT
  TICKET_ID
FROM
  TICKETS
WHERE
  EVENT_ID = :NEW.EVENT_ID
ORDER BY
  TICKET_ID DESC; --all ticks for that event
N1 INT :=0;
DELETE_COUNT INT;
INSERT_COUNT INT;
DIFF INT;
BEGIN
  SELECT
    COUNT(*) INTO N1
  FROM
    TICKETS
  WHERE
    EVENT_ID = :NEW.EVENT_ID; --number of tickets already in tickets table for this event
  DIFF := ABS(:OLD.NUM_OF_TICKETS - :NEW.NUM_OF_TICKETS);
  IF N1>:NEW.NUM_OF_TICKETS THEN
    FOR TICKET IN NUM_OF_TICKS LOOP
      DELETE FROM TICKETS
      WHERE
        TICKET_ID = TICKET;
      DELETE_COUNT := DELETE_COUNT+1;
      EXIT WHEN DELETE_COUNT = DIFF;
    END LOOP;
  END IF;

  IF N1<:NEW.NUM_OF_TICKETS THEN
    LOOP
      INSERT INTO TICKETS (
        EVENT_ID,
        TICKET_TYPE,
        VENUE_ID,
        BOOKED
      ) VALUES (
        :NEW.EVENT_ID,
        1,
        :NEW.VENUE_ID,
        'n'
      );
      INSERT_COUNT := INSERT_COUNT +1;
      EXIT WHEN INSERT_COUNT = DIFF;
    END LOOP;
  END IF;
END;
 --preemptively gives the first seat of the venue that hasnt been given to a ticket already and assigns that value to a ticket.
CREATE OR REPLACE TRIGGER TICKET_SEAT_NUM BEFORE INSERT ON TICKETS FOR EACH ROW DECLARE NUMSEAT INT;
BEGIN
  SELECT
    SEAT_NUM INTO :NEW.SEAT_NUM
  FROM
    SEATS
  WHERE
    VENUE_ID = :NEW.VENUE_ID
    AND BOOKED = 'n' FETCH FIRST 1 ROW ONLY;
  UPDATE SEATS
  SET
    BOOKED = 'y'
  WHERE
    SEAT_NUM = :NEW.SEAT_NUM;
END;

CREATE OR REPLACE TRIGGER TOO_MANY_TICKS BEFORE INSERT ON EVENTS FOR EACH ROW DECLARE NOT_ENOUGH_SPACE EXCEPTION;
MAXIMUM INT;
BEGIN
  SELECT
    VENUE_CAPACITY INTO MAXIMUM
  FROM
    VENUES
  WHERE
    VENUE_ID = :NEW.VENUE_ID;
  IF :NEW.NUM_OF_TICKETS > MAXIMUM THEN
    RAISE NOT_ENOUGH_SPACE;
  END IF;
END;

INSERT INTO TICKETS (
  EVENT_ID,
  TICKET_TYPE,
  VENUE_ID,
  BOOKED
) VALUES (
  2,
  1,
  1,
  '0'
);
CREATE TABLE VENUES ( VENUE_ID INT PRIMARY KEY, VENUE_NAME VARCHAR(255) NOT NULL, VENUE_CAPACITY INT NOT NULL, NUM_OF_PIT_SEATS INT NOT NULL, NUM_OF_GENERAL_SEATS INT NOT NULL, NUM_OF_BALCONY_SEATS INT NOT NULL, LOCATION_ID INT NOT NULL, CONSTRAINT LOCATION_FK FOREIGN KEY (LOCATION_ID) REFERENCES LOCATIONS (LOCATION_ID) );
 --autoincrement of venues, it needs to be done in a sequence and not within the table itself because this trigger must occur before the trigger
 --that creates the seats, so it needs the venue_ID and both occur before the row gets added in table.
CREATE SEQUENCE VENUE_ID_SEQ INCREMENT BY 1 START WITH 1;
DROP SEQUENCE VENUE_ID_SEQ;
CREATE OR REPLACE TRIGGER VENUE_ID_CONTROL BEFORE INSERT ON VENUES FOR EACH ROW BEGIN
  SELECT
    VENUE_ID_SEQ.NEXTVAL INTO :NEW.VENUE_ID
  FROM
    DUAL;
END;
/

SELECT
  *
FROM
  VENUES;

SELECT
  *
FROM
  SEATS;

INSERT INTO VENUES (
  VENUE_NAME,
  VENUE_CAPACITY,
  NUM_OF_PIT_SEATS,
  NUM_OF_GENERAL_SEATS,
  NUM_OF_BALCONY_SEATS,
  LOCATION_ID
) VALUES (
  'yankee stadium',
  10,
  5,
  5,
  5,
  1
);

INSERT INTO VENUES (
  VENUE_NAME,
  VENUE_CAPACITY,
  NUM_OF_PIT_SEATS,
  NUM_OF_GENERAL_SEATS,
  NUM_OF_BALCONY_SEATS,
  LOCATION_ID
) VALUES (
  'test',
  10,
  2,
  3,
  5,
  1
);

INSERT INTO VENUES (
  VENUE_NAME,
  VENUE_CAPACITY,
  NUM_OF_PIT_SEATS,
  NUM_OF_GENERAL_SEATS,
  NUM_OF_BALCONY_SEATS,
  LOCATION_ID
) VALUES (
  'another vanue',
  15,
  5,
  5,
  5,
  1
);

--func for auto creating entries for pit,general and balcony seats everytime a new venue is added
CREATE OR REPLACE TRIGGER FILL_SEATS AFTER
  INSERT ON VENUES FOR EACH ROW
DECLARE
  MAX_PIT_CAPACITY     INT := :NEW.NUM_OF_PIT_SEATS;
  MAX_GEN_CAPACITY     INT := :NEW.NUM_OF_GENERAL_SEATS;
  MAX_BALCONY_CAPACITY INT := :NEW.NUM_OF_BALCONY_SEATS;
BEGIN
  FOR I IN 1..MAX_PIT_CAPACITY LOOP
    INSERT INTO SEATS (
      SEAT_TYPE,
      VENUE_ID,
      BOOKED
    ) VALUES (
      1,
      :NEW.VENUE_ID,
      'n'
    );
  END LOOP;

  FOR I IN 1..MAX_GEN_CAPACITY LOOP
    INSERT INTO SEATS (
      SEAT_TYPE,
      VENUE_ID,
      BOOKED
    ) VALUES (
      2,
      :NEW.VENUE_ID,
      'n'
    );
  END LOOP;

  FOR I IN 1..MAX_BALCONY_CAPACITY LOOP
    INSERT INTO SEATS (
      SEAT_TYPE,
      VENUE_ID,
      BOOKED
    ) VALUES (
      3,
      :NEW.VENUE_ID,
      'n'
    );
  END LOOP;
END;

SELECT
  *
FROM
  VENUES;
SELECT
  *
FROM
  SEATS;
INSERT INTO VENUES (
  VENUE_NAME,
  VENUE_CAPACITY,
  NUM_OF_PIT_SEATS,
  NUM_OF_GENERAL_SEATS,
  NUM_OF_BALCONY_SEATS,
  LOCATION_ID
) VALUES (
  'seat_test',
  10,
  2,
  3,
  5,
  1
);
CREATE TABLE TICKETS( TICKET_ID INT, EVENT_ID INT NOT NULL, TICKET_TYPE INT NOT NULL, SEAT_NUM INT NOT NULL, VENUE_ID INT NOT NULL, BOOKED CHAR(1), PRIMARY KEY(TICKET_ID, EVENT_ID), CONSTRAINT TICKETS_EVENT_FK FOREIGN KEY (EVENT_ID) REFERENCES EVENTS(EVENT_ID), CONSTRAINT TICKETS_VENUE_FK FOREIGN KEY (VENUE_ID) REFERENCES VENUES(VENUE_ID), CONSTRAINT TICKETS_SEAT_NUM_FK FOREIGN KEY (SEAT_NUM, VENUE_ID) REFERENCES SEATS(SEAT_NUM, VENUE_ID), CONSTRAINT TICKETS_TICKET_TYPE_FK FOREIGN KEY (TICKET_TYPE) REFERENCES TICKET_TYPE(TICKET_TYPE) );
DROP TABLE TICKETS;
CREATE SEQUENCE TICKET_ID_SEQ;
CREATE OR REPLACE TRIGGER TICKET_ID_AUTO_INCREMENT BEFORE INSERT ON TICKETS FOR EACH ROW BEGIN
  SELECT
    COALESCE(MAX(TICKET_ID), -1) + 1 INTO :NEW.TICKET_ID
  FROM
    TICKETS
  WHERE
    EVENT_ID = :NEW.EVENT_ID;
END;
/

CREATE TABLE SEATS (
  SEAT_NUM INT,
  SEAT_TYPE INT NOT NULL,
  VENUE_ID INT,
  BOOKED CHAR(1),
  PRIMARY KEY (SEAT_NUM, VENUE_ID),
  CONSTRAINT SEATVENUE_FK FOREIGN KEY (VENUE_ID) REFERENCES VENUES(VENUE_ID),
  CONSTRAINT SEAT_TYPE_FK FOREIGN KEY (SEAT_TYPE) REFERENCES SEAT_TYPE(SEAT_TYPE_ID)
);

CREATE TABLE SEAT_TYPE(
  SEAT_TYPE_ID INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  SEAT_TYPE_NAME VARCHAR(255)
);

INSERT INTO SEAT_TYPE (
  SEAT_TYPE_NAME
) VALUES (
  'pit'
);

INSERT INTO SEAT_TYPE (
  SEAT_TYPE_NAME
) VALUES (
  'general'
);

INSERT INTO SEAT_TYPE (
  SEAT_TYPE_NAME
) VALUES (
  'balcony'
);

CREATE SEQUENCE SEAT_NUM_SEQ;

DROP SEQUENCE SEAT_NUM_SEQ;

CREATE OR REPLACE TRIGGER SEATS_AUTOINCREMENT BEFORE
  INSERT ON SEATS FOR EACH ROW
BEGIN
  SELECT
    COALESCE(MAX(SEAT_NUM), -1) + 1 INTO :NEW.SEAT_NUM
  FROM
    SEATS
  WHERE
    VENUE_ID = :NEW.VENUE_ID;
END;
/

CREATE TABLE TICKET_TYPE(
  TICKET_TYPE INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  TICKET_TYPE_NAME VARCHAR2(255) NOT NULL
);

INSERT INTO TICKET_TYPE (
  TICKET_TYPE_NAME
) VALUES (
  'cool'
);

INSERT INTO EVENT_CATEGORY (
  EVENT_CATEGORY_NAME
) VALUES (
  'Concert'
);

INSERT INTO EVENT_CATEGORY (
  EVENT_CATEGORY_NAME
) VALUES (
  'Sports Event'
);

SELECT
  *
FROM
  EVENT_CATEGORY;

INSERT INTO PERFORMER_TYPE(
  TYPE_NAME
) VALUES(
  'Musician'
);

INSERT INTO PERFORMER_TYPE(
  TYPE_NAME
) VALUES(
  'Comedian'
);

SELECT
  *
FROM
  PERFORMER_TYPE;

INSERT INTO PERFORMERS (
  PERFORMER_NAME,
  PERFORMER_TYPE
) VALUES (
  'The Strokes',
  1
);

INSERT INTO ORGANIZERS (
  ORGANIZER_NAME
) VALUES (
  'Sample Organizer'
);

INSERT INTO COUNTRIES (
  COUNTRY_NAME
) VALUES (
  'USA'
);

INSERT INTO LOCATIONS (
  LOCATION_NAME,
  COUNTRY_ID
) VALUES (
  'new york',
  1
);

INSERT INTO VENUES (
  VENUE_NAME,
  VENUE_CAPACITY,
  LOCATION_ID
) VALUES (
  'yankee stadium',
  7000,
  1
);

INSERT INTO VENUES (
  VENUE_NAME,
  VENUE_CAPACITY,
  LOCATION_ID
) VALUES (
  'test',
  10,
  1
);

INSERT INTO VENUES (
  VENUE_NAME,
  VENUE_CAPACITY,
  LOCATION_ID
) VALUES (
  'another vanue',
  10000,
  1
);

SELECT
  *
FROM
  VENUES;

INSERT INTO SEATS(
  SEAT_TYPE,
  VENUE_ID
) VALUES (
  'VIP',
  1
);

INSERT INTO SEATS(
  SEAT_TYPE,
  VENUE_ID
) VALUES (
  'VIP',
  1
);

INSERT INTO SEATS(
  SEAT_TYPE,
  VENUE_ID
) VALUES (
  'VIP',
  2
);

INSERT INTO SEATS(
  SEAT_TYPE,
  VENUE_ID
) VALUES (
  'VIP',
  2
);

INSERT INTO SEATS(
  SEAT_TYPE,
  VENUE_ID
) VALUES (
  'VIP',
  1
);

SELECT
  *
FROM
  SEATS;

SELECT
  *
FROM
  SEATS
WHERE
  VENUE_ID = 1;

INSERT INTO EVENTS (
  EVENT_NAME,
  VENUE_ID,
  EVENT_DATE,
  START_TIME,
  END_TIME,
  ORGANIZER_ID,
  PERFORMER_ID,
  EVENT_CATEGORY_ID,
  NUM_OF_TICKETS
) VALUES (
  'Random Concert',
  1,
  TO_DATE('2023-10-31', 'YYYY-MM-DD'),
  TO_TIMESTAMP('15:00:00', 'HH24:MI:SS'),
  TO_TIMESTAMP('18:00:00', 'HH24:MI:SS'),
  1,
  1,
  1,
  2
);

INSERT INTO EVENTS (
  EVENT_NAME,
  VENUE_ID,
  EVENT_DATE,
  START_TIME,
  END_TIME,
  ORGANIZER_ID,
  PERFORMER_ID,
  EVENT_CATEGORY_ID,
  NUM_OF_TICKETS
) VALUES (
  'Strokes Concert',
  1,
  TO_DATE('2023-10-31', 'YYYY-MM-DD'),
  TO_TIMESTAMP('15:00:00', 'HH24:MI:SS'),
  TO_TIMESTAMP('18:00:00', 'HH24:MI:SS'),
  1,
  1,
  1,
  7000
);

INSERT INTO TICKETS (
  EVENT_ID,
  TICKET_TYPE,
  SEAT_NUM
) VALUES (
  1,
  1,
  1
);

INSERT INTO TICKETS (
  EVENT_ID,
  TICKET_TYPE,
  SEAT_NUM
) VALUES (
  1,
  1,
  2
);

INSERT INTO TICKETS (
  EVENT_ID,
  TICKET_TYPE,
  SEAT_NUM
) VALUES (
  1,
  1,
  3
);

INSERT INTO TICKETS (
  EVENT_ID,
  TICKET_TYPE,
  SEAT_NUM
) VALUES (
  1,
  1,
  4
);

INSERT INTO TICKETS (
  EVENT_ID,
  TICKET_TYPE,
  SEAT_NUM
) VALUES (
  2,
  1,
  1
);

INSERT INTO TICKETS (
  EVENT_ID,
  TICKET_TYPE,
  SEAT_NUM
) VALUES (
  2,
  1,
  2
);

INSERT INTO TICKETS (
  EVENT_ID,
  TICKET_TYPE,
  SEAT_NUM
) VALUES (
  2,
  1,
  3
);

INSERT INTO TICKETS (
  EVENT_ID,
  TICKET_TYPE,
  SEAT_NUM
) VALUES (
  2,
  1,
  4
);

INSERT INTO TICKETS (
  EVENT_ID,
  TICKET_TYPE,
  SEAT_NUM
) VALUES (
  2,
  1,
  4
);

SELECT
  *
FROM
  TICKETS;

SELECT
  *
FROM
  LOCATIONS;

SELECT
  *
FROM
  EVENT_CATEGORY;

SELECT
  *
FROM
  ORGANIZERS;

SELECT
  *
FROM
  PERFORMERS;

SELECT
  *
FROM
  VENUES;

SELECT
  *
FROM
  EVENTS;