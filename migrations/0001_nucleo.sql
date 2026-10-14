CREATE TABLE IF NOT EXISTS schema_migrations (
  version text PRIMARY KEY,
  aplicada_en timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE project (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id bigint NOT NULL,
  nombre text NOT NULL,
  plantilla text,
  creado_por text NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT now(),
  actualizado_en timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE phase (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id bigint NOT NULL,
  project_id uuid NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  orden int NOT NULL,
  nombre text NOT NULL,
  checklist jsonb NOT NULL DEFAULT '[]'::jsonb,
  UNIQUE (project_id, orden)
);

CREATE TABLE profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id bigint NOT NULL,
  nombre text NOT NULL,
  skills jsonb NOT NULL DEFAULT '{}'::jsonb,
  prompt_base text NOT NULL DEFAULT '',
  creado_en timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE meeting (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id bigint NOT NULL,
  project_id uuid REFERENCES project(id) ON DELETE SET NULL,
  phase_id uuid REFERENCES phase(id) ON DELETE SET NULL,
  profile_id uuid REFERENCES profile(id) ON DELETE SET NULL,
  titulo text NOT NULL,
  estado text NOT NULL DEFAULT 'programada'
    CHECK (estado IN ('programada', 'grabando', 'pausada', 'finalizada', 'procesando', 'lista', 'error')),
  zona_horaria text NOT NULL DEFAULT 'America/Guayaquil',
  started_at timestamptz,
  ended_at timestamptz,
  audio_waka_id text,
  consentimiento_ok boolean NOT NULL DEFAULT false,
  retencion_hasta timestamptz,
  creado_por text NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE segment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id bigint NOT NULL,
  meeting_id uuid NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
  inicio_s numeric(10, 3) NOT NULL CHECK (inicio_s >= 0),
  fin_s numeric(10, 3) NOT NULL CHECK (fin_s >= inicio_s),
  hablante text,
  texto text NOT NULL,
  confianza real,
  creado_en timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX project_tenant_idx ON project (tenant_id);
CREATE INDEX phase_tenant_idx ON phase (tenant_id, project_id);
CREATE INDEX profile_tenant_idx ON profile (tenant_id);
CREATE INDEX meeting_tenant_idx ON meeting (tenant_id, creado_en DESC);
CREATE INDEX segment_meeting_idx ON segment (tenant_id, meeting_id, inicio_s);

ALTER TABLE project ENABLE ROW LEVEL SECURITY;
ALTER TABLE phase ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting ENABLE ROW LEVEL SECURITY;
ALTER TABLE segment ENABLE ROW LEVEL SECURITY;

ALTER TABLE project FORCE ROW LEVEL SECURITY;
ALTER TABLE phase FORCE ROW LEVEL SECURITY;
ALTER TABLE profile FORCE ROW LEVEL SECURITY;
ALTER TABLE meeting FORCE ROW LEVEL SECURITY;
ALTER TABLE segment FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_aislado ON project
  USING (tenant_id = current_setting('app.tenant_id', true)::bigint)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE POLICY tenant_aislado ON phase
  USING (tenant_id = current_setting('app.tenant_id', true)::bigint)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE POLICY tenant_aislado ON profile
  USING (tenant_id = current_setting('app.tenant_id', true)::bigint)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE POLICY tenant_aislado ON meeting
  USING (tenant_id = current_setting('app.tenant_id', true)::bigint)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE POLICY tenant_aislado ON segment
  USING (tenant_id = current_setting('app.tenant_id', true)::bigint)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::bigint);

INSERT INTO schema_migrations (version) VALUES ('0001_nucleo');
