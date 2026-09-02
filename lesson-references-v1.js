window.LESSON_REFERENCES={
  title:'Clover Lesson 9 — Grammar & Usage Map',
  subtitle:'40問を「骨格 → 時間 → 節 → 数量 → 語法 → 語順」でつなぐ。',
  sections:[
    {
      title:'0. 全体地図',type:'map',lead:'ばらばらに見える問題も，最初に「どこを見る問題か」を決めると整理できる。',
      groups:[
        {lesson:true,title:'文の骨格',items:['help O do','keep O C','make O C','let O do','make oneself p.p.'],note:'O と C の間に小さな文を復元する。'},
        {lesson:true,title:'時間・助動詞',items:['to have p.p.','would','need','have been p.p.','ought to have p.p.','had p.p.'],note:'基準時と「話し手の判断」を分けて読む。'},
        {lesson:true,title:'節・関係',items:['why','whose','Though / as','what節','that節','as'],note:'後ろの節が完全か不完全か，何の関係を作るかを見る。'},
        {lesson:true,title:'否定・数量・比較',items:['none','if any','another','no less than','less than','not ... until'],note:'0・追加・比較の大きさを集合と数直線で考える。'},
        {lesson:true,title:'準動詞・省略',items:['without -ing','only to do','if trained','feel like -ing'],note:'役割・能動/受動・時間関係を確認する。'},
        {lesson:true,title:'語彙・句動詞',items:['stand up for','run into','call off','make believe','come up with','gradually','formerly'],note:'単語の足し算ではなく，文脈の中のまとまりで意味を取る。'},
        {lesson:true,title:'語順',items:['so + adj + a + N','not only A but B','what節 + be + that節','固定表現'],note:'訳順ではなく，S/V/O/C と意味のかたまりから組み立てる。'}
      ]
    },
    {
      title:'1. 文の骨格',type:'branch',lead:'SVOC は O + C を「小さな文」に戻す。',
      rows:[
        {head:'原形',core:'O does C',branches:['help camels survive','let the news be disclosed','have others do']},
        {head:'形容詞',core:'O is C',branches:['keep me awake','make the relationship fun']},
        {head:'p.p.',core:'O is done',branches:['make yourself understood','be disclosed to reporters']}
      ]
    },
    {
      title:'2. 時間・助動詞',type:'flow',lead:'形を選ぶ前に，基準時と出来事の前後を置く。',
      nodes:['基準時を決める','→','同時 / 前を判定','→','完了形を選ぶ','→','助動詞の評価を重ねる']
    },
    {
      title:'3. 節・関係',type:'matrix',lead:'関係詞・接続詞は「後ろの節」と「意味関係」をセットで見る。',
      headers:['型','見る場所','Lesson 9'],
      rows:[
        ['所有','先行詞 + 名詞','people whose culture ...'],
        ['理由','完全な節','That was why ...'],
        ['譲歩','逆接関係','Young as ... = Though ...'],
        ['名詞節','節全体が S/O/C','What impressed me ... / that Mother Teresa ...'],
        ['様態','〜するように','as you would have others do ...']
      ]
    },
    {
      title:'4. 数量・否定・比較',type:'compare',lead:'日本語訳だけでなく，「0か／追加か／多いか」を図にする。',
      columns:[
        {badge:'ZERO',title:'none / if any',body:'none = 集合の0個。if any = 「あるとしても」。',meaning:'存在量を読む'},
        {badge:'ADD',title:'another 30 minutes',body:'追加の1まとまり。「もう30分」。',meaning:'another + 数量'},
        {badge:'AMOUNT',title:'no less than / less than',body:'no less than = 〜も，less than = 〜未満。',meaning:'話し手の評価 + 数の境界'}
      ]
    },
    {
      title:'5. 語彙・句動詞',type:'matrix',lead:'句動詞は「場面」と「目的語」を見て，同義語へ置き換える。',
      headers:['表現','意味','見分ける場面'],
      rows:[
        ['stand up for','support','議論で人の側に立つ'],['run into','meet unexpectedly','偶然の出会い'],['call off','cancel','予定・行事を中止'],['make believe','pretend','〜のふりをする'],['come up with','offer / devise','案・運賃などを出す'],['gradually','little by little','徐々の変化'],['formerly','previously','以前の地位・状態']
      ]
    },
    {title:'6. 整序の作り方',type:'flow',lead:'長い整序ほど，1語ずつ動かさない。',nodes:['定形Vを決める','→','S / O / C を置く','→','節をかたまり化','→','熟語を固定','→','修飾語を接続','→','全文で意味確認']}
  ]
};
