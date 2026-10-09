ALTER TABLE public.teams DROP CONSTRAINT IF EXISTS teams_letter_check;
ALTER TABLE public.teams ADD CONSTRAINT teams_letter_check CHECK (letter ~ '^[A-Z]{1,3}$');

UPDATE public.system_settings
   SET extra = (COALESCE(extra, '{}'::jsonb) - 'max_team_leaders')
 WHERE id = 1;