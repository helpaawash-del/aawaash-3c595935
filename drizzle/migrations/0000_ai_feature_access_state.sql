CREATE TABLE public.ai_feature_state (id text PRIMARY KEY, message text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_feature_state TO authenticated;
GRANT ALL ON public.ai_feature_state TO service_role;
ALTER TABLE public.ai_feature_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY ai_feature_state_admin ON public.ai_feature_state FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'super_admin'::public.app_role));