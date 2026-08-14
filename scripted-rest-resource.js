(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {

    // ===== CORS =====
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // ===================== CONFIGURAÇÃO =====================
    var TABELA_ANS        = 'x_bdb_5ul_00000368_ans_v2';
    var TABELA_INDICADOR  = 'x_bdb_5ul_00000368_indicadores';
    var TABELA_OFERTA     = 'x_bdb_5ul_00000368_oferta_de_servi_o_indicadores';
    var TABELA_RAC        = 'x_bdb_5ul_00000368_registro_de_acompanhamento';
    var TABELA_RCO        = 'x_bdb_5ul_00000368_gns_registro_nao_conformidade';

    var CAMPO_NOME_ANS    = 'numero_ans';
    var CAMPO_AREA        = 'nome_uor';
    var CAMPO_SERVICO     = 'servico_original';
    var CAMPO_OFERTA      = 'oferta_servico';
    var CAMPO_HOSTNAME    = 'hostname';
    var CAMPO_INDICADORES = 'indicadores';
    // ========================================================

    // ---------- helpers ----------
    function fixUtf8(s){ if(!s) return s; try { return decodeURIComponent(escape(s)); } catch(e){ return s; } }

    function getParam(name){
        if (request.queryParams && request.queryParams[name] && request.queryParams[name].length) {
            return String(request.queryParams[name][0]);
        }
        try {
            var b = (request.body && request.body.data) ? request.body.data : null;
            if (b && b[name] != null && b[name] !== '') return String(b[name]);
        } catch(e) {}
        return '';
    }

    function num(v){ var n = parseFloat(v); return isNaN(n) ? null : n; }
    function ehConforme(resultado){ return (resultado||'').toLowerCase() === 'conformidade'; }

    var _hostCache = {};
    function getHostname(id){
        if(!id) return '';
        if(_hostCache.hasOwnProperty(id)) return _hostCache[id];
        var g = new GlideRecord(TABELA_OFERTA);
        _hostCache[id] = g.get(id) ? g.getValue(CAMPO_HOSTNAME) : '';
        return _hostCache[id];
    }
    function resolveOfertas(listValue){
        if(!listValue) return [];
        var ids = listValue.split(','), out = [];
        for (var i=0;i<ids.length;i++){ var id = ids[i].trim(); if(!id) continue; var h=getHostname(id); if(h) out.push(h); }
        return out;
    }

    var MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    function labelPeriodo(d){
        if(!d) return '';
        var p = d.split('-'); if(p.length<2) return d;
        var idx = parseInt(p[1],10)-1;
        return ((idx>=0&&idx<12)?MESES[idx]:p[1]) + '/' + p[0];
    }

    // ======================================================
    // HANDLER PADRÃO — comportamento ORIGINAL (array puro)
    // ======================================================
    function listarIndicadoresTodos(){
        var json = [];
        var gr = new GlideRecord(TABELA_INDICADOR);
        gr.query();
        while (gr.next()) {
            json.push({
                number: gr.number.toString(),
                nome_indicador: gr.nome_indicador.toString(),
                servico: gr.getDisplayValue('servico').toString(),
                oferta_de_servico: gr.getDisplayValue('oferta_de_servico').toString(),
                tipo: gr.getDisplayValue('tipo').toString(),
                unidade_de_medida: gr.unidade_de_medida.toString(),
                direcao: gr.getDisplayValue('direcao').toString(),
                periodicidade: gr.getDisplayValue('periodicidade').toString(),
                nivel_ofertado: gr.nivel_ofertado.toString(),
                prd: gr.getDisplayValue('prd').toString(),
                pds: gr.getDisplayValue('pds').toString(),
                uor: gr.uor.id.toString(),
                focal_user: gr.getDisplayValue('focal_user').toString(),
                email_uor_responsavel: gr.getDisplayValue('email_uor_responsavel').toString(),
                natureza: gr.getDisplayValue('natureza').toString(),
                informacoes_adicionais: gr.informacoes_adicionais.toString(),
                status: gr.getDisplayValue('status').toString(),
                sys_created_on: gr.sys_created_on.toString(),
                ans_de_origem: gr.getDisplayValue('ans_de_origem').toString(),
                approved_by: gr.getDisplayValue('approved_by').toString(),
                dados_do_solicitante: gr.dados_do_solicitante.toString(),
                sys_id: gr.sys_id.toString(),
                url: "https://"+gs.getProperty('instance_name')+".service-now.com/gns_portal?id=disp_indicador&table="+TABELA_INDICADOR+"&sys_id="+gr.sys_id.toString()
            });
        }
        return json;
    }

    // ======================================================
    // HANDLER: ANS por ÁREA (big numbers) + % de conformidade (via RCO)
    // ======================================================
    function ansPorArea(){
        var area = fixUtf8(getParam('area'));
        if(!area) return { __status:400, __body:{ error:"Parâmetro 'area' é obrigatório." } };

        // 1) ANS da área
        var gr = new GlideRecord(TABELA_ANS);
        gr.addNotNullQuery(CAMPO_NOME_ANS);
        gr.addQuery(CAMPO_AREA, 'CONTAINS', area.toUpperCase());
        gr.orderBy('numero_ans');
        gr.query();

        var anss = [], byId = {}, ansIds = [];
        while (gr.next()) {
            var sid = gr.getValue('sys_id');
            var item = {
                number: gr.getValue('number'),
                numero_ans: gr.getValue('numero_ans'),
                apelido: gr.getValue('apelido'),
                objetivo: gr.getValue('objetivo'),
                servico: gr.getValue('servico_original'),
                ofertas: resolveOfertas(gr.getValue(CAMPO_OFERTA)),
                oferta_fixo: gr.getValue('oferta_fixo'),
                nome_uor: gr.getValue('nome_uor'),
                cd_uor: gr.getValue('cd_uor'),
                status: gr.getDisplayValue('status'),
                state: gr.getDisplayValue('state'),
                active: gr.getValue('active'),
                opened_at: gr.getValue('opened_at'),
                closed_at: gr.getValue('closed_at'),
                sys_id: sid,
                url: "https://"+gs.getProperty('instance_name')+".service-now.com/gns_portal?id=disp_ans&table="+TABELA_ANS+"&sys_id="+sid,
                conformidade: null,
                conformidade_conformes: 0,
                conformidade_total: 0
            };
            anss.push(item); byId[sid] = item; ansIds.push(sid);
        }

        // 2) RCO de todos os ANS (1 query) -> conta conformes/total por ANS
        if (ansIds.length) {
            var rco = new GlideRecord(TABELA_RCO);
            rco.addQuery('ans', 'IN', ansIds.join(','));
            rco.query();
            while (rco.next()) {
                var it = byId[rco.getValue('ans')];
                if (!it) continue;
                it.conformidade_total++;
                if (ehConforme(rco.getValue('resultado'))) it.conformidade_conformes++;
            }
            for (var i=0;i<anss.length;i++){
                var t = anss[i].conformidade_total, c = anss[i].conformidade_conformes;
                anss[i].conformidade = t > 0 ? Math.round((c/t)*1000)/10 : null;
            }
        }

        return { count: anss.length, area_filtro: area.toUpperCase(), result: anss };
    }

    // ======================================================
    // HANDLER: ANS por SERVIÇO
    // ======================================================
    function ansPorServico(){
        var servico = fixUtf8(getParam('servico'));
        var gr = new GlideRecord(TABELA_ANS);
        gr.addNotNullQuery(CAMPO_NOME_ANS);
        if (servico) gr.addQuery(CAMPO_SERVICO, servico);
        gr.orderByDesc('sys_created_on');
        gr.query();

        var result = [], ofertasUnicas = {};
        while (gr.next()) {
            var ofr = resolveOfertas(gr.getValue(CAMPO_OFERTA));
            for (var i=0;i<ofr.length;i++) ofertasUnicas[ofr[i]] = true;
            result.push({
                number: gr.getValue('number'),
                numero_ans: gr.getValue('numero_ans'),
                apelido: gr.getValue('apelido'),
                objetivo: gr.getValue('objetivo'),
                servico: gr.getValue('servico_original'),
                ofertas: ofr,
                oferta_fixo: gr.getValue('oferta_fixo'),
                indicadores: gr.getValue(CAMPO_INDICADORES),
                nome_uor: gr.getValue('nome_uor'),
                status: gr.getDisplayValue('status'),
                state: gr.getDisplayValue('state'),
                active: gr.getValue('active'),
                sys_id: gr.getValue('sys_id'),
                url: "https://"+gs.getProperty('instance_name')+".service-now.com/gns_portal?id=disp_ans&table="+TABELA_ANS+"&sys_id="+gr.getValue('sys_id')
            });
        }
        var ofertas = [];
        for (var n in ofertasUnicas) if (ofertasUnicas.hasOwnProperty(n)) ofertas.push(n);
        ofertas.sort();
        return { count: result.length, servico_filtro: servico||null, ofertas: ofertas, result: result };
    }

    // ======================================================
    // HANDLER: ans_racs — acompanhamento mensal (RAC) de um ANS
    // ======================================================
    function ansRacs(){
        var ans = fixUtf8(getParam('ans'));
        if(!ans) return { __status:400, __body:{ error:"Parâmetro 'ans' (sys_id) é obrigatório." } };

        var grAns = new GlideRecord(TABELA_ANS);
        if(!grAns.get(ans)) return { __status:404, __body:{ error:'ANS não encontrado.', ans:ans } };

        var header = {
            numero_ans: grAns.getValue('numero_ans'),
            apelido: grAns.getValue('apelido'),
            servico: grAns.getValue('servico_original'),
            ofertas: resolveOfertas(grAns.getValue(CAMPO_OFERTA)),
            nome_uor: grAns.getValue('nome_uor'),
            opened_at: grAns.getValue('opened_at'),
            closed_at: grAns.getValue('closed_at'),
            sys_id: grAns.getValue('sys_id')
        };

        // RACs do ANS
        var racs = [], byRac = {}, racIds = [];
        var gr = new GlideRecord(TABELA_RAC);
        gr.addQuery('ans', ans);
        gr.orderByDesc('periodo_date');
        gr.query();
        while (gr.next()) {
            var sid = gr.getValue('sys_id');
            var row = {
                number: gr.getValue('number'),
                periodo: gr.getValue('periodo'),
                periodo_date: gr.getValue('periodo_date'),
                periodo_label: labelPeriodo(gr.getValue('periodo_date')),
                resultado: gr.getDisplayValue('conformidade'),  // texto do RAC (ex.: "Conformidade")
                resultado_code: gr.getValue('conformidade'),     // código bruto
                data_de_abertura: gr.getValue('data_de_abertura'),
                data_de_conclusao: gr.getValue('data_de_conclusao'),
                status: gr.getDisplayValue('status'),
                state: gr.getDisplayValue('state'),
                total_indicadores: 0,
                fora_da_meta: 0,
                sys_id: sid
            };
            racs.push(row); byRac[sid] = row; racIds.push(sid);
        }

        // contagem de RCOs por RAC (1 query) -> "X de Y fora da meta"
        if (racIds.length) {
            var rco = new GlideRecord(TABELA_RCO);
            rco.addQuery('registro_de_acompanhamento', 'IN', racIds.join(','));
            rco.query();
            while (rco.next()) {
                var r = byRac[rco.getValue('registro_de_acompanhamento')];
                if (!r) continue;
                r.total_indicadores++;
                if (!ehConforme(rco.getValue('resultado'))) r.fora_da_meta++;
            }
        }

        return { count: racs.length, ans_filtro: ans, ans_number: grAns.getValue('number'),
                 ans: header, result: racs };
    }

    // ======================================================
    // HANDLER: rac_rcos — RCOs (indicadores) de um RAC
    // ======================================================
    function racRcos(){
        var rac = fixUtf8(getParam('rac'));
        if(!rac) return { __status:400, __body:{ error:"Parâmetro 'rac' (sys_id) é obrigatório." } };

        var grRac = new GlideRecord(TABELA_RAC);
        if(!grRac.get(rac)) return { __status:404, __body:{ error:'RAC não encontrado.', rac:rac } };

        // RCOs do RAC
        var rcos = [], indIds = {};
        var rco = new GlideRecord(TABELA_RCO);
        rco.addQuery('registro_de_acompanhamento', rac);
        rco.query();
        while (rco.next()) {
            var indId = rco.getValue('indicador');
            if (indId) indIds[indId] = true;
            rcos.push({
                id: rco.getValue('id'),                  // RCO0001337
                number: rco.getValue('number'),          // TASK...
                indicador_sys_id: indId,
                apurado: num(rco.getValue('apuracao_no_periodo')),
                resultado: rco.getValue('resultado'),    // "conformidade" | "indicio" | "nao_conformidade"
                periodo: rco.getValue('periodo'),
                periodo_date: rco.getValue('periodo_date'),
                periodo_label: labelPeriodo(rco.getValue('periodo_date')),
                motivo: rco.getValue('motivo'),
                situacao: rco.getValue('situacao'),
                sys_id: rco.getValue('sys_id')
            });
        }

        // metadados dos indicadores (1 query)
        var idsCsv = [];
        for (var k in indIds) if (indIds.hasOwnProperty(k)) idsCsv.push(k);
        var meta = {};
        if (idsCsv.length) {
            var gi = new GlideRecord(TABELA_INDICADOR);
            gi.addQuery('sys_id', 'IN', idsCsv.join(','));
            gi.query();
            while (gi.next()) {
                meta[gi.getValue('sys_id')] = {
                    number: gi.getValue('number'),
                    nome_indicador: gi.getValue('nome_indicador'),
                    tipo: gi.getDisplayValue('tipo'),
                    direcao: gi.getDisplayValue('direcao'),
                    nivel_ofertado: gi.getValue('nivel_ofertado'),
                    unidade_de_medida: gi.getDisplayValue('unidade_de_medida'),
                    periodicidade: gi.getDisplayValue('periodicidade')
                };
            }
        }

        // junta RCO + metadados e consolida o mês
        var result = [], total = 0, fora = 0;
        for (var i=0;i<rcos.length;i++) {
            var m = meta[rcos[i].indicador_sys_id] || {};
            total++;
            if (!ehConforme(rcos[i].resultado)) fora++;
            result.push({
                rco_id: rcos[i].id,
                rco_number: rcos[i].number,
                indicador_sys_id: rcos[i].indicador_sys_id,
                indicador_number: m.number || null,
                nome_indicador: m.nome_indicador || null,
                tipo: m.tipo || null,
                direcao: m.direcao || null,
                meta: num(m.nivel_ofertado),
                unidade_de_medida: m.unidade_de_medida || null,
                periodicidade: m.periodicidade || null,
                apurado: rcos[i].apurado,
                resultado: rcos[i].resultado,
                motivo: rcos[i].motivo,
                situacao: rcos[i].situacao,
                periodo: rcos[i].periodo,
                periodo_label: rcos[i].periodo_label,
                sys_id: rcos[i].sys_id
            });
        }

        return {
            count: result.length,
            rac_filtro: rac,
            rac_number: grRac.getValue('number'),
            periodo: grRac.getValue('periodo'),
            periodo_label: labelPeriodo(grRac.getValue('periodo_date')),
            resultado: grRac.getDisplayValue('conformidade'),
            total_indicadores: total,
            fora_da_meta: fora,
            result: result
        };
    }

    // ======================================================
    // HANDLER: rco_historico — detalhe do indicador + histórico (via RCO)
    // ======================================================
    function rcoHistorico(){
        var rcoParam = fixUtf8(getParam('rco'));
        if(!rcoParam) return { __status:400, __body:{ error:"Parâmetro 'rco' (sys_id ou id RCO...) é obrigatório." } };

        var meses = parseInt(getParam('meses'),10);
        if (isNaN(meses) || meses <= 0) meses = 6;

        var ehSysId = /^[0-9a-f]{32}$/i.test(rcoParam);
        var base = new GlideRecord(TABELA_RCO);
        var achou = ehSysId ? base.get(rcoParam) : base.get('id', rcoParam);
        if(!achou) return { __status:404, __body:{ error:'RCO não encontrado.', rco:rcoParam } };

        var indRef      = base.getValue('indicador');
        var ansRef      = base.getValue('ans');
        var periodoBase = base.getValue('periodo_date');
        var baseSysId   = base.getValue('sys_id');

        // detalhe do RCO clicado
        var rcoDetalhe = {
            id: base.getValue('id'),
            number: base.getValue('number'),
            apurado: num(base.getValue('apuracao_no_periodo')),
            resultado: base.getValue('resultado'),
            periodo: base.getValue('periodo'),
            periodo_label: labelPeriodo(periodoBase),
            motivo: base.getValue('motivo'),
            acoes_preventivas: base.getValue('acoes_preventivas'),
            parecer_do_aprovador: base.getValue('parecer_do_aprovador'),
            data_de_resposta: base.getValue('data_de_resposta'),
            situacao: base.getValue('situacao'),
            reiteracoes: base.getValue('reiteracoes'),
            sys_id: baseSysId
        };

        // cabeçalho do indicador
        var info = {};
        if (indRef) {
            var gi = new GlideRecord(TABELA_INDICADOR);
            if (gi.get(indRef)) {
                info = {
                    sys_id: gi.getValue('sys_id'),
                    number: gi.getValue('number'),
                    nome_indicador: gi.getValue('nome_indicador'),
                    tipo: gi.getDisplayValue('tipo'),
                    servico: gi.getDisplayValue('servico') || gi.getValue('servico_fixo'),
                    oferta_de_servico: gi.getDisplayValue('oferta_de_servico') || gi.getValue('oferta_fixo'),
                    meta: gi.getValue('nivel_ofertado'),
                    direcao: gi.getDisplayValue('direcao'),
                    periodicidade: gi.getDisplayValue('periodicidade'),
                    unidade_de_medida: gi.getDisplayValue('unidade_de_medida')
                };
            }
        }
        var metaNum = info.meta != null ? num(info.meta) : null;

        // histórico: RCOs do MESMO indicador/ANS até o período base (últimos N)
        var gr = new GlideRecord(TABELA_RCO);
        if (indRef) gr.addQuery('indicador', indRef);
        if (ansRef) gr.addQuery('ans', ansRef);
        if (periodoBase) gr.addQuery('periodo_date', '<=', periodoBase);
        gr.orderByDesc('periodo_date');
        gr.setLimit(meses);
        gr.query();

        var serie = [];
        while (gr.next()) {
            serie.push({
                rco_id: gr.getValue('id'),
                periodo: gr.getValue('periodo'),
                periodo_date: gr.getValue('periodo_date'),
                periodo_label: labelPeriodo(gr.getValue('periodo_date')),
                apurado: num(gr.getValue('apuracao_no_periodo')),
                meta: metaNum,
                resultado: gr.getValue('resultado'),
                selecionada: gr.getValue('sys_id') === baseSysId,
                sys_id: gr.getValue('sys_id')
            });
        }
        serie.reverse(); // cronológico

        return {
            count: serie.length,
            rco_base: rcoDetalhe.id,
            periodo_base: periodoBase,
            meses: meses,
            indicador: info,
            rco: rcoDetalhe,
            result: serie
        };
    }

    // ======================================================
    // DISPATCHER
    // ======================================================
    try {
        var acao = (getParam('acao') || getParam('action') || '').toLowerCase();
        var saida;

        switch (acao) {
            case 'ans_area':
            case 'big_numbers':
                saida = ansPorArea(); break;
            case 'ans_servico':
                saida = ansPorServico(); break;
            case 'ans_racs':
            case 'acompanhamento':
                saida = ansRacs(); break;
            case 'rac_rcos':
            case 'indicadores_rac':
                saida = racRcos(); break;
            case 'rco_historico':
            case 'historico':
                saida = rcoHistorico(); break;
            default:
                response.setBody(listarIndicadoresTodos());
                return;
        }

        if (saida && saida.__status) { response.setStatus(saida.__status); response.setBody(saida.__body); }
        else { response.setBody(saida); }

    } catch (e) {
        response.setStatus(500);
        response.setBody({ error: 'Erro ao processar a requisição.', detail: e.message });
    }

})(request, response);
