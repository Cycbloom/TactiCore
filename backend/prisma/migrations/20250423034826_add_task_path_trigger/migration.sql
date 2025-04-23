-- 创建触发器函数

CREATE OR REPLACE FUNCTION update_task_path() RETURNS TRIGGER AS $$
BEGIN
    -- 如果是新任务
    IF TG_OP = 'INSERT' THEN
        IF NEW."parentId" IS NULL THEN
            NEW."path" = ARRAY[NEW.id];
        ELSE
            SELECT "path" || NEW.id INTO NEW."path"
            FROM "Task"
            WHERE id = NEW."parentId";
        END IF;
    -- 如果是更新任务
    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW."parentId" IS DISTINCT FROM OLD."parentId" THEN
            IF NEW."parentId" IS NULL THEN
                NEW."path" = ARRAY[NEW.id];
            ELSE
                SELECT "path" || NEW.id INTO NEW."path"
                FROM "Task"
                WHERE id = NEW."parentId";
            END IF;

            -- 更新所有子任务的路径
            WITH RECURSIVE task_tree AS (
                SELECT id, "parentId", "path"
                FROM "Task"
                WHERE "parentId" = NEW.id
                UNION ALL
                SELECT t.id, t."parentId", t."path"
                FROM "Task" t
                JOIN task_tree tt ON t."parentId" = tt.id
            )
            UPDATE "Task" t
            SET "path" = NEW."path" || t.id
            FROM task_tree tt
            WHERE t.id = tt.id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器

DROP TRIGGER IF EXISTS task_path_trigger ON "Task";


CREATE TRIGGER task_path_trigger
BEFORE
INSERT
OR
UPDATE ON "Task"
FOR EACH ROW EXECUTE FUNCTION update_task_path();

