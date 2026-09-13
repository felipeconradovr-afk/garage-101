-- Garage 101 — seed inicial (executar após schema.sql)
-- WhatsApp padrão: 5551995888316

insert into public.site_settings (id, whatsapp, instagram, address, opening_hours, hero_title, hero_subtitle)
values (1, '5551995888316', '', '', '', 'ESTÉTICA QUE DEVOLVE O BRILHO AO SEU VEÍCULO.', 'Polimento profissional, higienização e cuidado completo para carros, caminhões e máquinas agrícolas.')
on conflict (id) do nothing;

insert into public.services (title, slug, short_description, description, sort_order) values
('Polimento automotivo','polimento-automotivo','Recuperação do brilho, correção visual e valorização da pintura.','O cuidado com a pintura começa nos detalhes. Nosso polimento completo reúne lavagem externa, polimento, lavagem com produtos desengordurantes, enceramento com cera cristalizadora e revitalização dos plásticos externos. Converse com a Garage 101 para avaliar o seu veículo e combinar o atendimento.',1),
('Higienização interna','higienizacao-interna','Limpeza profunda de bancos, tecidos e superfícies internas.','O interior do seu veículo também merece atenção. A higienização interna cuida dos bancos, tecidos e superfícies para uma sensação renovada de limpeza e conforto. Informe o modelo do veículo e o que precisa de cuidado para solicitar um orçamento.',2),
('Higienização de estofamentos','higienizacao-de-estofamentos','Limpeza profunda para sofás, colchões e outros estofados.','Um novo cuidado para os espaços do seu dia a dia. A higienização ajuda a remover sujeira acumulada e odores, preservando o material e a sensação de conforto. Envie uma foto do sofá, colchão ou estofado pelo WhatsApp para conversar sobre o serviço.',3),
('Caminhões','caminhoes','Cuidado e estética para veículos de grande porte.','Do carro ao pesado, o cuidado continua o mesmo. A Garage 101 também atende caminhões. Conte o modelo e o serviço desejado para consultar as possibilidades de atendimento e agendamento.',4),
('Máquinas agrícolas','maquinas-agricolas','Limpeza e acabamento para máquinas utilizadas no campo.','A atenção ao acabamento também chega às máquinas do campo. Fale com a Garage 101 sobre sua máquina agrícola e o cuidado que ela precisa. As condições do serviço são combinadas no orçamento.',5)
on conflict (slug) do nothing;

-- Exemplos de galeria vazia por padrão (descomente se quiser demonstração):
-- insert into public.gallery (title, category, before_image, after_image, description, featured) values
-- ('Sedan preto — polimento','Polimento','https://seu-bucket/garage-media/demo-before.webp','https://seu-bucket/garage-media/demo-after.webp','Correção e proteção com cera cristalizadora.', true)
-- on conflict do nothing;

-- Para liberar o primeiro administrador, após criar o usuário em Auth > Users, copie o UUID e execute:
-- insert into public.admin_users (user_id) values ('SEU_UUID_AQUI') on conflict do nothing;
