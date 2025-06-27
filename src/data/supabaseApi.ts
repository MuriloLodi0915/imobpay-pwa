import { supabase } from '../supabaseClient';

// PROPERTIES (Imóveis)
export async function getProperties(userId: number) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function addProperty(userId: number, title: string, address: string, description: string) {
  const { data, error } = await supabase
    .from('properties')
    .insert([{ user_id: userId, title, address, description }]);
  if (error) throw error;
  return data;
}

export async function updateProperty(id: number, fields: any) {
  const { data, error } = await supabase
    .from('properties')
    .update(fields)
    .eq('id', id);
  if (error) throw error;
  return data;
}

export async function deleteProperty(id: number) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// TENANTS (Inquilinos)
export async function getTenants(userId: number) {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function addTenant(userId: number, name: string, email: string, cpf: string, phone: string) {
  const { data, error } = await supabase
    .from('tenants')
    .insert([{ user_id: userId, name, email, cpf, phone }]);
  if (error) throw error;
  return data;
}

export async function updateTenant(id: number, fields: any) {
  const { data, error } = await supabase
    .from('tenants')
    .update(fields)
    .eq('id', id);
  if (error) throw error;
  return data;
}

export async function deleteTenant(id: number) {
  const { error } = await supabase
    .from('tenants')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// CONTRACTS (Contratos)
export async function getContracts(userId: number) {
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function addContract(userId: number, property_id: number, tenant_id: number, start_date: string, end_date: string, rent_value: number, status: string) {
  const { data, error } = await supabase
    .from('contracts')
    .insert([{ user_id: userId, property_id, tenant_id, start_date, end_date, rent_value, status }]);
  if (error) throw error;
  return data;
}

export async function updateContract(id: number, fields: any) {
  const { data, error } = await supabase
    .from('contracts')
    .update(fields)
    .eq('id', id);
  if (error) throw error;
  return data;
}

export async function deleteContract(id: number) {
  const { error } = await supabase
    .from('contracts')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// PAYMENTS (Pagamentos/Financeiro)
export async function getPayments(userId: number) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function addPayment(userId: number, contract_id: number, due_date: string, payment_date: string, value: number, status: string, type: string, description: string) {
  const { data, error } = await supabase
    .from('payments')
    .insert([{ user_id: userId, contract_id, due_date, payment_date, value, status, type, description }]);
  if (error) throw error;
  return data;
}

export async function updatePayment(id: number, fields: any) {
  const { data, error } = await supabase
    .from('payments')
    .update(fields)
    .eq('id', id);
  if (error) throw error;
  return data;
}

export async function deletePayment(id: number) {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// REPORTS (Relatórios)
export async function getReports(userId: number) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function addReport(userId: number, name: string, filters: any) {
  const { data, error } = await supabase
    .from('reports')
    .insert([{ user_id: userId, name, filters }]);
  if (error) throw error;
  return data;
}

export async function deleteReport(id: number) {
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', id);
  if (error) throw error;
} 