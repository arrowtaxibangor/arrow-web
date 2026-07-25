import { axios, baseurl } from '../utils/axios';

export const getPagesLink = async () => {
  const res = await fetch('/api/cms/pages');
  if (!res.ok) throw new Error('Failed to fetch pages');
  return res.json();
};

export const getPageBySlug = async (slug: string) => {
  return await axios.get(`${baseurl}/cms/pages/slug/${slug}`).then((res) => res.data);
};
