"""Migration for a given Submitty course database."""


def up(config, database, semester, course):
    """
    Run up migration.

    :param config: Object holding configuration details about Submitty
    :type config: migrator.config.Config
    :param database: Object for interacting with given database for environment
    :type database: migrator.db.Database
    :param semester: Semester of the course being migrated
    :type semester: str
    :param course: Code of course being migrated
    :type course: str
    """
    
    # Add columns to the course_materials table.
    database.execute("ALTER TABLE course_materials ADD COLUMN IF NOT EXISTS uploaded_by character varying(255) REFERENCES users(user_id) DEFAULT NULL;")
    database.execute("ALTER TABLE course_materials ADD COLUMN IF NOT EXISTS upload_date TIMESTAMP WITH TIME ZONE DEFAULT NULL;")
    database.execute("ALTER TABLE course_materials ADD COLUMN IF NOT EXISTS last_edit_by character varying(255) REFERENCES users(user_id) DEFAULT NULL;")
    database.execute("ALTER TABLE course_materials ADD COLUMN IF NOT EXISTS last_edit_date TIMESTAMP WITH TIME ZONE DEFAULT NULL;")

    database.execute("UPDATE course_materials SET last_edit_by = uploaded_by, last_edit_date = upload_date;")

    


def down(config, database, semester, course):
    """
    Run down migration (rollback).

    :param config: Object holding configuration details about Submitty
    :type config: migrator.config.Config
    :param database: Object for interacting with given database for environment
    :type database: migrator.db.Database
    :param semester: Semester of the course being migrated
    :type semester: str
    :param course: Code of course being migrated
    :type course: str
    """
    pass
