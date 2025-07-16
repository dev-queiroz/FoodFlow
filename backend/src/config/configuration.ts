export default () => {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_KEY!;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('SUPABASE_URL e SUPABASE_KEY devem ser definidos no arquivo .env');
    }

    return {
        port: parseInt(process.env.PORT || '3000', 10),
        supabase: {
            url: supabaseUrl,
            key: supabaseKey,
        },
    };
};