module.exports = function (grunt) {
    grunt.initConfig({
        
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            options: {
                includePaths: ['bower_components/foundation/scss']
            },
            dist: {
                options: {
                    outputStyle: 'expanded'
                },
                files: {
                    'html/desktop/lib/css/dlreboot.css': 'scss/app.scss',
                    'html/mobile/lib/css/dlreboot.css': 'scss/app.scss',
                    'html/legacy/lib/css/dlreboot.css': 'scss/app.scss',
                    'original/lib/css/dlreboot.css': 'scss/app.scss'
                }
            }
        },

        stripmq: {
            options: {
                width: 990
            },
            all: {
                files: {
                    'html/desktop/lib/css/ie8.css' : 'html/desktop/lib/css/dlreboot.css',
                    'html/mobile/lib/css/ie8.css' : 'html/mobile/lib/css/dlreboot.css',
                    'html/legacy/lib/css/ie8.css' : 'html/legacy/lib/css/dlreboot.css',
                    'original/lib/css/ie8.css' : 'original/lib/css/dlreboot.css'
                }
            }
        },


        //
        // Module for counting the number of css selectors.
        // IE9 ignores any selectors over the 4096 limit.
        // 
        ie9_selector_counter: {
          options: {
          // Task-specific options go here.
          },
          files: ['original/lib/css/dlreboot.css', 
            'original/lib/css/ie9.css', 
            'original/lib/css/ie9-blessed1.css', 
            'original/lib/css/ie8.css']
        },        
        

        //
        // Module for splitting large css files into multiple parts.
        // Fix for IE9 which has a 4096 limit on selectors.
        // 
        bless: {
            css: {
              options: {
                compress: true,
                cleanup: true
              },
              files: {
                'html/desktop/lib/css/ie9.css' : 'original/lib/css/dlreboot.css',
                'html/mobile/lib/css/ie9.css' : 'original/lib/css/dlreboot.css',
                'html/legacy/lib/css/ie9.css' : 'original/lib/css/dlreboot.css',
                'html/desktop/lib/css/ie8.css' : 'original/lib/css/ie8.css',
                'html/mobile/lib/css/ie8.css' : 'original/lib/css/ie8.css',
                'html/legacy/lib/css/ie8.css' : 'original/lib/css/ie8.css'
              }
            }
          },

        // htmlbuild: {
        //     flat: {
        //         src: getFileList(),
        //         dest: 'html/build/flat/',
        //         options: {
        //             beautify: true,
        //             sections: {
        //                 layout: getIncludes('html/includes/')
        //             }
        //         }
        //     },
        //     jsp: {
        //         src: getFileList(),
        //         dest: 'html/build/jsp/',
        //         options: {
        //             beautify: true,
        //             sections: {
        //                 layout: getIncludes('html/includes/jspincludes/')
        //             }
        //         }
        //     },
        //     ssi: {
        //         src: getFileList(),
        //         dest: 'html/build/ssi/',
        //         options: {
        //             beautify: true,
        //             sections: {
        //                 layout: getIncludes('html/includes/ssincludes/')
        //             }
        //         }
        //     }
        // },
        shell: {
            cleancss: {
                 options: {
                    failOnError: false
                },
                command: 'rm -r -f html/lib/css'
            },
            flatlibcopy: {
                options: {
                    failOnError: false
                },
                command: 'rm -r -f html/build/flat/lib && cp -r html/lib html/build/flat/lib'
            },
            jspclean: {
                options: {
                    failOnError: false
                },
                command: 'rm -r -f html/build/jsp'
            },
            jsplibcopy: {
                options: {
                    failOnError: false
                },
                command: 'cp -r html/lib html/build/jsp/lib && cp -r html/includes/* html/build/jsp/'
            },
            jsprename: {
                options: {
                    failOnError: false
                },
                command: 'for i in $(find html/build/jsp | grep .html); do mv $(echo $i) $(echo $i | cut -d "." -f1).jsp; done;'
            },
            flatclean: {
                options: {
                    failOnError: false
                },
                command: 'rm -r -f html/build/flat'
            },
            ssiclean: {
                options: {
                    failOnError: false
                },
                command: 'rm -r -f html/build/ssi'
            },
            ssilibcopy: {
                options: {
                    failOnError: false
                },
                command: 'cp -r html/lib html/build/ssi/lib && cp -r html/includes/* html/build/ssi/'
            },
            cleanincludes: {
                options: {
                    failOnError: false
                },
                command: 'rm -r -f html/build/ssi/jspincludes && rm -r -f html/build/ssi/ssincludes && rm -r -f html/build/jsp/jspincludes && rm -r -f html/build/jsp/ssincludes'
            }
        },
        watch: {
            grunt: {
                files: ['Gruntfile.js']
            },

            files: {
                files: ['scss/**/*.scss', 'html/lib/img/**/*', 'html/lib/js/**/*', 'html/lib/fonts/**/*', 'html/*.html', 'html/includes/**/*', 'Gruntfile.js'],
                tasks: ['build']
            }
        }     
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-stripmq');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-ie9-selector-counter');
    grunt.loadNpmTasks('grunt-bless');

    // grunt.registerTask('buildhtml', ['shell:flatclean', 'htmlbuild:flat', 'shell:flatlibcopy']);
    // grunt.registerTask('buildjsp', ['shell:jspclean', 'htmlbuild:jsp', 'shell:jsplibcopy', 'shell:jsprename', 'shell:cleanincludes']);
    // grunt.registerTask('buildssi', ['shell:ssiclean', 'htmlbuild:ssi', 'shell:ssilibcopy', 'shell:cleanincludes']);
    // grunt.registerTask('build', ['shell:cleancss', 'sass', 'stripmq', 'buildhtml', 'buildssi', 'buildjsp']);
    grunt.registerTask('build', ['sass', 'stripmq', 'split','count']);   
    grunt.registerTask('default', ['build', 'watch']);
    grunt.registerTask('count', ['ie9_selector_counter']);
    grunt.registerTask('split', ['sass','stripmq','bless']);

};

// function getFileList() {
//     var fl = [];
//     var fs = require('fs');
//     var items = fs.readdirSync('html/');
//     items.forEach(
//         function (item) {
//             if (item.indexOf('.html') > -1) {
//                 fl.push("html/" + item);
//             }
//         }
//     );
//     return fl;
// }

// function getIncludes(path, list) {
//     var fl = list ? list : {};
//     var fs = require('fs');
//     var items = fs.readdirSync(path);
//     items.forEach(
//         function (item) {
//             if (fs.statSync(path + item).isFile() && item.indexOf('.html') > -1) {
//                 var key = item.replace('_', '').replace('.html', '');
//                 fl[key] = path + item;
//             } else if(item.indexOf('jspincludes') == -1 && item.indexOf('ssincludes') == -1){
//                 getIncludes(path + item + '/', fl);
//             }
//         }
//     );
//     return fl;
// }