"""rename room created_by to creator_id

Revision ID: 04661283acd4
Revises: 08edcecd8a91
Create Date: 2026-06-12 10:57:49.705501

"""

from alembic import op

# revision identifiers, used by Alembic.
revision = '04661283acd4'
down_revision = '08edcecd8a91'
branch_labels = None
depends_on = None


def upgrade():

    # Rename column while preserving data
    op.execute(
        """
        ALTER TABLE rooms
        RENAME COLUMN created_by TO creator_id
        """
    )

    # Rename foreign key constraint
    op.execute(
        """
        ALTER TABLE rooms
        RENAME CONSTRAINT rooms_created_by_fkey
        TO rooms_creator_id_fkey
        """
    )


def downgrade():

    # Rename column back
    op.execute(
        """
        ALTER TABLE rooms
        RENAME COLUMN creator_id TO created_by
        """
    )

    # Rename foreign key constraint back
    op.execute(
        """
        ALTER TABLE rooms
        RENAME CONSTRAINT rooms_creator_id_fkey
        TO rooms_created_by_fkey
        """
    )