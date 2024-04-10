<?php include 'header.blade.php';?>
         <style>
             span.number {
                margin-right: 15px;
                height: calc(2rem - 1px);
                width: calc(2rem - 1px);
                border-radius: 50%;
                border: 1px solid currentcolor;
                color: #0a512f;
                opacity: 1;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            small {
                font-size: .7em;
            }
            ul {
                padding-left: 0;
            }
            li {
                list-style: none;
            }
         </style>
         <section class="search">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="input-group rounded">
                            <span class="input-group-text" id="search-addon" style="margin-right: -40px; background: transparent; border: none;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-search">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                                </svg>
                            </span>
                            <input type="text" id="myInput" onkeyup="myFunction()" class="form-control rounded search_field" placeholder="  আয়াত খুঁজুন " aria-label="Search" aria-describedby="search-addon" style="background :  rgb(255 255 255 / 80%); padding-left: 40px;">
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="body-section">
            <div class="container">
                <div class="card">
                    <div class="card-body">
                        <div class="surah_menu">
                            
            			</div>
                        <ul class="style_1" id="myUL">
                            <li >
                                <a href="sura/al-fatiha.php" class="d-inline-flex align-items-center">
                                    <span class="number">১</span>
                    		        <span class="title">
                    		             আল-ফাতিহা (সূচনা) 
                    		            <p class="sub-name">→ Al-Fatiha</p>
                            			<small>
                            				আয়াত - ৭, মাক্কী
                            			</small>
                    		        </span>
                    			</a>
                			</li >
                			<div class="border-line"></div>
                			<li >
                    			<a href="sura/al-baqarah.php" class="d-inline-flex align-items-center">
                                    <span class="number">
                                        ২
                                    </span>
                    		        <span class="title">
                    		              আল-বাক্বারাহ্ (বকনা-বাছুর)
                    		            <p class="sub-name">→ Al-Baqarah</p>
                            			<small>
                            				 আয়াত - ২৮৬, মাদানী
                            			</small>
                    		        </span>
                    			</a>
                			</li >
                			<div class="border-line"></div>
                    		<li >
                    		    <a href="sura/al-imran.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৩
                                    </span>
                    		        <span class="title">
                        		            আলে-ইমরান (ইমরানের পরিবার)
                            		    <p class="sub-name">→ Al-Imran</p>
                            			<small>
                            				আয়াত - ২০০, মাদানী
                            			</small>
                    		        </span>
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/an-nisa.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৪
                                    </span>
                    		        <span class="title">
                        		            আন-নিসা (মহিলা)
                        		        <p class="sub-name">→ An-Nisa</p>
                            			<small>
                            				আয়াত - ১৭৬, মাদানী
                            			</small>
                    		        </span>
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-maidah.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৫
                                    </span>
                    		        <span class="title">
                    		            আল-মায়েদাহ্ (খাদ্য পরিবেশিত টেবিল)
                    		            <p class="sub-name">→ Al-Maidah</p>
                            			<small>
                            				আয়াত - ১২০, মাদানী
                            			</small>
                    		        </span>
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-anam.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৬
                                    </span>
                    		        <span class="title">
                    		            আল-আনআম (গৃৃহপালিত পশু)
                    		            <p class="sub-name">→ Al-Anam</p>
                            			<small>
                            				আয়াত - ১৬৫, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-araf.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৭
                                    </span>
                    		        <span class="title">
                    		            আল-আ‘রাফ (উচু স্থানসমূহ)
                    		            <p class="sub-name">→ Al-Araf</p>
                            			<small>
                            				আয়াত - ২০৬, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-anfal.php">
                    		        
                    		        <span class="title">
                    		            আল-আনফাল (যুদ্ধে-লব্ধ ধনসম্পদ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৭৫, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/at-taubah.php">
                    		        <span class="title">
                    		            আত-তাওবাহ্ (অনুশোচনা)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১২৯, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/yunus.php">
                    		        <span class="title">
                    		            ইউনুস (নবী ইউনুস)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১০৯, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/hud.php">
                    		        <span class="title">
                    		            হুদ (নবী হুদ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১২৩, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/yusuf.php">
                    		        <span class="title">
                    		            ইউসুফ (নবী ইউসুফ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১১১, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/ar-rad.php">
                    		        <span class="title">
                    		            আর-রাদ  (বজ্রনাদ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৪৩, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/Ibrahim.php">
                    		        <span class="title">
                    		            ইব্রাহীম (নবী ইব্রাহিম)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৫২, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-hijr.php">
                    		        <span class="title">
                    		            আল-হিজর (পাথুরে পাহাড়)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৯৯, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/an-nahl.php">
                    		        <span class="title">
                    		            আন-নাহ্‌ল (মৌমাছি)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১২৮, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-isra.php">
                    		        <span class="title">
                    		            আল-ইসরা (ইসরায়েলের সন্তানগণ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১১১, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-kahf.php">
                    		        <span class="title">
                    		            আল-কাহফ (গুহা)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১১০, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/maryam.php">
                    		        <span class="title">
                    		            মারইয়াম (মারিয়াম (নবী ঈসার মা))
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৯৮, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/ta-ha.php">
                    		        <span class="title">
                    		            ত্বোয়া-হা (ত্বোয়া-হা)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১৩৫, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-ambiya.php">
                    		        <span class="title">
                    		            আল-আম্বিয়া (নবীগণ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১১২, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-hajj.php">
                    		        <span class="title">
                    		            আল-হাজ্জ (হাজ্জ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৭৮, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-muminun.php">
                    		        <span class="title">
                    		            আল-মু’মিনূন (বিশ্বাসীগণ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১১৮, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/an-nur.php">
                    		        <span class="title">
                    		            আন-নূর (আলো,জ্যোতি)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৬৪, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-furqan.php">
                    		        <span class="title">
                    		            আল-ফুরক্বান (সত্য মিথ্যার পার্থক্য নির্ধারণকারী গ্রন্থ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৭৭, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/ash-shura.php">
                    		        <span class="title">
                    		            আশ-শুরা (পরামর্শ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ২২৭, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/an-naml.php">
                    		        <span class="title">
                    		            আন-নামল (পিপীলিকা)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৯৩, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-qasas.php">
                    		        <span class="title">
                    		            আল-ক্বাসাস (ঘটনা,কাহিনী)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৮৮, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-ankabut.php">
                    		        <span class="title">
                    		            আল-আনকাবূত (মাকড়সা)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৬৯, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/ar-rum.php">
                    		        <span class="title">
                    		            আর-রূম (রোমান জাতি)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৬০, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/luqman.php">
                    		        <span class="title">
                    		            লুক্বমান (একজন জ্ঞানী ব্যক্তি)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৩৪, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/as-sajdah.php">
                    		        <span class="title">
                    		            আস-সাজদা (সিজদাহ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৩০, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-aḥzab.php">
                    		        <span class="title">
                    		            আল-আহযাব (জোট)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৭৩, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/saba.php">
                    		        <span class="title">
                    		            সাবা (রানী সাবা)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৫৪, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/fatir.php">
                    		        <span class="title">
                    		            ফাতের (আদি স্রষ্টা)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৪৫, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/ya-sin.php">
                    		        <span class="title">
                    		            ইয়াসীন (ইয়াসীন)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৮৩, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/as-saaffat.php">
                    		        <span class="title">
                    		            আস-সাফ্‌ফাত (সারিবদ্ধভাবে দাড়ানো)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১৮১, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/sad.php">
                    		        <span class="title">
                    		            সুরত সদ (আরবি বর্ণ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৮৮, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/az-zumar.php">
                    		        <span class="title">
                    		            আয-যুমার (দল-বদ্ধ জনতা)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৭৫, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-muminun.php">
                    		        <span class="title">
                    		            আল মু'মিন (বিশ্বাসী)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৮৫, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/ha-mīm-as-Sajdah.php">
                    		        <span class="title">
                    		            হা-মীম সেজদাহ্‌ (সুস্পষ্ট বিবরণ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৫৪, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/surah.php">
                    		        <span class="title">
                    		            আশ-শূরা (পরামর্শ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৫৩, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/az-zukhruf.php">
                    		        <span class="title">
                    		            আয-যুখরুফ (সোনাদানা)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৮৯, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/ad-dukhan.php">
                    		        <span class="title">
                    		            আদ-দুখান (ধোঁয়া)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৫৯, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-jathiya.php">
                    		        <span class="title">
                    		            আল-জাসিয়া (নতজানু)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৩৭, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-ahqaf.php">
                    		        <span class="title">
                    		            আল-আহক্বাফ (বালুর পাহাড়)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৩৫, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/muhammad.php">
                    		        <span class="title">
                    		            মুহাম্মাদ (নবী মুহাম্মদ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৩৮, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-fath.php">
                    		        <span class="title">
                    		            আল-ফাতহ (মক্কা বিজয়)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ২৯, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-hujurat.php">
                    		        <span class="title">
                    		            আল-হুজুরাত (বাসগৃহসমূূহ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১৮, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-kahf.php">
                    		        <span class="title">
                    		            সুরত ক্বাফ (আরবি বর্ণ ক্বাফ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৪৫, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/az-zariyat.php">
                    		        <span class="title">
                    		            আয-যারিয়াত (বিক্ষেপকারী বাতাস)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৬০, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/at-tur.php">
                    		        <span class="title">
                    		            আত-তূর (পাহাড়)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৪৯, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/an-najm.php">
                    		        <span class="title">
                    		            আন-নাজম (তারা)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৬২, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-qamar.php">
                    		        <span class="title">
                    		            আল-ক্বামার (চন্দ্র)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৫৫, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/ar-rahman.php">
                    		        <span class="title">
                    		            আর-রাহমান (অনন্ত করুণাময়)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৭৮, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-waqia.php">
                    		        <span class="title">
                    		            আল-ওয়াক্বিয়া (নিশ্চিত ঘটনা)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৯৬, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-hadid.php">
                    		        <span class="title">
                    		            আল-হাদীদ (লোহা)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ২৯, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-mujadila.php">
                    		        <span class="title">
                    		            আল-মুজাদালাহ্ (অনুযোগকারিণী)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ২২, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-hashr.php">
                    		        <span class="title">
                    		            আল-হাশর (সমাবেশ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ২৪, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-mumtahanahphp">
                    		        <span class="title">
                    		            আল-মুমতাহিনা (নারী, যাকে পরীক্ষা করা হবে)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১৩, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/as-saff.php">
                    		        <span class="title">
                    		            আস-সাফ (সারবন্দী সৈন্যদল)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১৪, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-jumuah.php">
                    		        <span class="title">
                    		            আল-জুমু‘আ (সম্মেলন/শুক্রবার)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১১, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-munafiqun.php">
                    		        <span class="title">
                    		            আল-মুনাফিক্বূন (কপট বিশ্বাসীগণ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১১, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/at-taghabun.php">
                    		        <span class="title">
                    		            আত-তাগাবুন (মোহ অপসারণ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১৮, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/at-talaq.php">
                    		        <span class="title">
                    		            আত-ত্বালাক (তালাক,বন্ধনমুক্তি)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১২, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/at-tahrim.php">
                    		        <span class="title">
                    		            আত-তাহরীম (নিষিদ্ধকরণ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ১২, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-mulk.php">
                    		        <span class="title">
                    		            আল-মুলক (সার্বভৌম কর্তৃত্ব)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৩০, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-qalam.php">
                    		        <span class="title">
                    		            আল-ক্বালাম (কলম)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৫২, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-haqqa.php">
                    		        <span class="title">
                    		            আল-হাক্কাহ্ (নিশ্চিত সত্য)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৫২, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-maarij.php">
                    		        <span class="title">
                    		            আল-মা‘আরেজ (উন্নয়নের সোপান)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৪৪, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/nuh.php">
                    		        <span class="title">
                    		            নূহ (নবী নূহ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ২৮, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-jinn.php">
                    		        <span class="title">
                    		            আল-জিন্ন (জ্বিন সম্প্রদায়)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ২৮, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-muzzammil.php">
                    		        <span class="title">
                    		            আল-মুযযাম্মিল (বস্ত্র আচ্ছাদনকারী)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ২০, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-muddaththir.php">
                    		        <span class="title">
                    		            আল-মুদ্দাস্‌সির (পোশাক পরিহিত)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৫৬, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-qiyama.php">
                    		        <span class="title">
                    		            আল-ক্বিয়ামাহ্‌ (পুনরুথান)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৪০, মাক্কী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-insan.php">
                    		        <span class="title">
                    		            আল-ইনসান (মানুষ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৩১, মাদানী
                        			</small>
                    			</a>
                    		</li>
							<li>
                    		    <a href="sura/al-mursalat.php">
                    		        <span class="title">
                    		            আল-মুরসালাত (প্রেরিত পুরুষবৃন্দ)
                    		        </span>
                        		    <p class="sub-name">→ -------</p>
                        			<small>
                        				আয়াত - ৫০, মাক্কী
                        			</small>
                    			</a>
                    		</li>
                    		
							<li>
                    		    <a href="sura/an-naba.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৭৮
                                    </span>
                    		        <span class="title">
                    		            আন-নাবা (মহাসংবাদ)
                    		            <p class="sub-name">→ An-Naba</p>
                            			<small>
                            				আয়াত - ৪০, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/an-naziat.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৭৯
                                    </span>
                    		        <span class="title">
                    		            আন-নাযিয়াত (প্রচেষ্টাকারী)
                    		            <p class="sub-name">→ An-Naziat</p>
                            			<small>
                            				আয়াত - ৪৬, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/abasa.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৮০
                                    </span>
                    		        <span class="title">
                    		            আবাসা (তিনি ভ্রুকুটি করলেন)
                    		            <p class="sub-name">→ Abasa</p>
                            			<small>
                            				আয়াত - ৪২, মাক্কী
                            			</small>
                    		        </span>
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/at-takwir.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৮১
                                    </span>
                    		        <span class="title">
                    		            আত-তাকভীর (অন্ধকারাচ্ছন্ন)
                    		            <p class="sub-name">→ At-Takwir</p>
                            			<small>
                            				আয়াত - ২৯, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-infitar.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৮২
                                    </span>
                    		        <span class="title">
                    		            আল-ইনফিতার (বিদীর্ণ করা)
                    		            <p class="sub-name">→ Al-Infitar</p>
                            			<small>
                            				আয়াত - ১৯, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-mutaffifin.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৮৩
                                    </span>
                    		        <span class="title">
                    		            আল-মুতাফফিফীন (প্রতারকগণ)
                    		            <p class="sub-name">→ Al-Mutaffifin</p>
                            			<small>
                            				আয়াত - ৩৬, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-inshiqaq.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৮৪
                                    </span>
                    		        <span class="title">
                    		            আল-ইনশিক্বাক (খন্ড-বিখন্ড করণ)
                    		            <p class="sub-name">→ Al-Inshiqaq</p>
                            			<small>
                            				আয়াত - ২৫, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-burooj.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৮৫
                                    </span>
                    		        <span class="title">
                    		            আল-বুরূজ (নক্ষত্রপুঞ্জ)
                    		            <p class="sub-name">→ Al-Burooj</p>
                            			<small>
                            				আয়াত - ২২, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/at-tariq.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৮৬
                                    </span>
                    		        <span class="title">
                    		            আত-ত্বারেক (রাতের আগন্তুক)
                    		            <p class="sub-name">→ At-Tariq</p>
                            			<small>
                            				আয়াত - ১৭, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-ala.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৮৭
                                    </span>
                    		        <span class="title">
                    		            আল-আ‘লা (সর্বোর্ধ্ব)
                    		            <p class="sub-name">→ Al-Ala</p>
                            			<small>
                            				আয়াত - ১৯, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-ghashiyah.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৮৮
                                    </span>
                    		        <span class="title">
                    		            আল-গাশিয়াহ্ (বিহ্বলকর ঘটনা)
                    		            <p class="sub-name">→ Al-Ghashiyah</p>
                            			<small>
                            				আয়াত - ২৬, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-fajr.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৮৯
                                    </span>
                    		        <span class="title">
                    		            আল-ফাজর (ভোরবেলা)
                    		            <p class="sub-name">→ Al-Fajr</p>
                            			<small>
                            				আয়াত - ৩০, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-balad.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৯০
                                    </span>
                    		        <span class="title">
                    		            আল-বালাদ (নগর)
                    		            <p class="sub-name">→ Al-Balad</p>
                            			<small>
                            				আয়াত - ২০, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/ash-shams.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৯১
                                    </span>
                    		        <span class="title">
                    		            আশ-শামস (সূর্য্য)
                    		            <p class="sub-name">→ Ash-Shams.php</p>
                            			<small>
                            				আয়াত - ১৫, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-lail.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৯২
                                    </span>
                    		        <span class="title">
                    		            আল-লাইল (রাত্রি)
                    		            <p class="sub-name">→ Al-Lail</p>
                            			<small>
                            				আয়াত - ২১, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/ad-dhuha.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৯৩
                                    </span>
                    		        <span class="title">
                    		            আদ্ব-দ্বুহা (পূর্বাহ্নের সূর্যকিরণ)
                    		            <p class="sub-name">→ Ad-Dhuha</p>
                            			<small>
                            				আয়াত - ১১, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-inshirah.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৯৪
                                    </span>
                    		        <span class="title">
                    		            আল ইনশিরাহ (বক্ষ প্রশস্তকরণ)
                    		            <p class="sub-name">→ Al-inshirah</p>
                            			<small>
                            				আয়াত - ৮, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/at-tin.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৯৫
                                    </span>
                    		        <span class="title">
                    		            আত-তীন (ডুমুর)
                    		            <p class="sub-name">→ At-Tin</p>
                            			<small>
                            				আয়াত - ৮, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-alaq.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৯৬
                                    </span>
                    		        <span class="title">
                    		            আল-আলাক্ব (রক্তপিন্ড)
                    		            <p class="sub-name">→ Al-Alaq</p>
                            			<small>
                            				আয়াত - ১৯, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-qadr.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৯৭
                                    </span>
                    		        <span class="title">
                    		            আল-ক্বাদর (পরিমাণ)
                    		            <p class="sub-name">→ Al-Qadr</p>
                            			<small>
                            				আয়াত - ৫, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-bayyina.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৯৮
                                    </span>
                    		        <span class="title">
                    		            আল-বায়্যিনাহ্ (সুস্পষ্ট প্রমাণ)
                    		            <p class="sub-name">→ Al-Bayyina</p>
                            			<small>
                            				আয়াত - ৮, মাদানী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-zalzalah.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ৯৯
                                    </span>
                    		        <span class="title">
                    		            আল-যিলযাল (ভূমিকম্প)
                    		            <p class="sub-name">→ Al-Zalzalah</p>
                            			<small>
                            				আয়াত - ৮, মাদানী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-adiyat.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ১০০
                                    </span>
                    		        <span class="title">
                    		            আল-আদিয়াত (অভিযানকারী)
                    		            <p class="sub-name">→ Al-Adiyat</p>
                            			<small>
                            				আয়াত - ১১, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-qaria.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ১০১
                                    </span>
                    		        <span class="title">
                    		            আল-ক্বারিআহ্ (মহাসংকট)
                    		            <p class="sub-name">→ Al-Qaria</p>
                            			<small>
                            				আয়াত - ১১, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/at-takathur.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ১০২
                                    </span>
                    		        <span class="title">
                    		            আত-তাকাসুর (প্রাচুর্যের প্রতিযোগিতা)
                    		            <p class="sub-name">→ At-Takathur</p>
                            			<small>
                            				আয়াত - ৮, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-asr.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ১০৩
                                    </span>
                    		        <span class="title">
                    		            আল-আসর (অপরাহ্ন)
                    		            <p class="sub-name">→ Al-Asr</p>
                            			<small>
                            				আয়াত - ৩, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-humazah.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ১০৪
                                    </span>
                    		        <span class="title">
                    		            আল-হুমাযাহ্ (পরনিন্দাকারী)
                    		            <p class="sub-name">→ Al-Humazah</p>
                            			<small>
                            				আয়াত - ৯, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-fil.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ১০৫
                                    </span>
                    		        <span class="title">
                    		            আল-ফীল (হাতি)
                    		            <p class="sub-name">→ Al-Fil</p>
                            			<small>
                            				আয়াত - ৫, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/quraysh.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ১০৬
                                    </span>
                    		        <span class="title">
                    		            ক্বুরাইশ (কুরাইশ গোত্র)
                    		            <p class="sub-name">→ Quraysh</p>
                            			<small>
                            				আয়াত - ৪, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-maun.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ১০৭
                                    </span>
                    		        <span class="title">
                    		            আল-মাঊন (সাহায্য-সহায়তা)
                    		            <p class="sub-name">→ Al-Maun</p>
                            			<small>
                            				আয়াত - ৭, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-kawthar.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ১০৮
                                    </span>
                    		        <span class="title">
                    		            আল-কাউসার (প্রাচুর্য)
                    		            <p class="sub-name">→ Al-Kawthar</p>
                            			<small>
                            				আয়াত - ৩, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-kafirun.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ১০৯
                                    </span>
                    		        <span class="title">
                    		            আল-কাফিরূন (অস্বীকারকারীগণ)
                    		            <p class="sub-name">→ Al-Kafirun</p>
                            			<small>
                            				আয়াত - ৬, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/an-nasr.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ১১০
                                    </span>
                    		        <span class="title">
                    		            আন-নাসর (বিজয়,সাহায্য)
                    		            <p class="sub-name">→ An-Nasr</p>
                            			<small>
                            				আয়াত - ৩, মাদানী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/lahab.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ১১১
                                    </span>
                    		        <span class="title">
                    		            লাহাব (জ্বলন্ত অঙ্গার)
                    		            <p class="sub-name">→ Al-Lahab / Al-Masad</p>
                            			<small>
                            				আয়াত - ৫, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-ikhlas.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ১১২
                                    </span>
                    		        <span class="title">
                    		            আল-ইখলাস (একনিষ্ঠতা)
                    		            <p class="sub-name">→ Al-Ikhlas</p>
                            			<small>
                            				আয়াত - ৪, মাক্কী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/al-falaq.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ১১৩
                                    </span>
                    		        <span class="title">
                    		            আল-ফালাক্ব (নিশিভোর)
                    		            <p class="sub-name">→ Al-Falaq</p>
                            			<small>
                            				আয়াত - ৫, মাদানী
                            			</small>
                    		        </span>
                        		    
                    			</a>
                    		</li>
                    		<div class="border-line"></div>
							<li>
                    		    <a href="sura/an-nas.php" class="d-inline-flex align-items-center">
                    		        <span class="number">
                                        ১১৪
                                    </span>
                    		        <span class="title"> 
                    		            আন-নাস (মানবজাতি )
                    		            <p class="sub-name">→ An-Nas</p>
                            			<small>
                            				আয়াত - ৬, মাদানী
                            			</small>
                    		        </span>
                    		        
                    			</a>
                    		</li>
                		</ul>
                    </div>
                </div>
            </div>
        </section>
        
<?php include 'footer.blade.php';?>